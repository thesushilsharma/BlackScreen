"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { terminalConfigSchema } from "@/lib/terminal-validation";
import type { TerminalConfig } from "@/lib/terminal-validation";
import type { Terminal } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";
import {
  createTerminalSession,
  executeTerminalCommand,
} from "@/app/actions/terminal.action";

export const useTerminal = (config: TerminalConfig) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const currentLine = useRef("");

  // Use refs to store current values for async operations
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const isConnectedRef = useRef(false);

  const terminalThemes = {
    dark: {
      background: "#1a1a1a",
      foreground: "#ffffff",
      cursor: "#ffffff",
      cursorAccent: "#1a1a1a",
      selection: "#ffffff40",
      black: "#000000",
      red: "#ff6b6b",
      green: "#51cf66",
      yellow: "#ffd93d",
      blue: "#74c0fc",
      magenta: "#d0bfff",
      cyan: "#8cc8ff",
      white: "#ffffff",
      brightBlack: "#666666",
      brightRed: "#ff7979",
      brightGreen: "#6bcf7f",
      brightYellow: "#fff3a0",
      brightBlue: "#a8dadc",
      brightMagenta: "#e9c9ff",
      brightCyan: "#b4e7ff",
      brightWhite: "#ffffff",
    },
    light: {
      background: "#ffffff",
      foreground: "#000000",
      cursor: "#000000",
      cursorAccent: "#ffffff",
      selection: "#00000040",
    },
    matrix: {
      background: "#000000",
      foreground: "#00ff00",
      cursor: "#00ff00",
      cursorAccent: "#000000",
      selection: "#00ff0040",
    },
    ocean: {
      background: "#0f1419",
      foreground: "#b3b1ad",
      cursor: "#ff6600",
      cursorAccent: "#0f1419",
      selection: "#ff660040",
    },
  };

  const executeCommand = useCallback(async (command: string) => {
    if (!command.trim()) return;

    // Use refs to get current values
    const currentTerminal = terminalInstanceRef.current;
    const currentIsConnected = isConnectedRef.current;

    console.log("Executing command:", command);
    console.log("Terminal available:", !!currentTerminal);
    console.log("Is connected:", currentIsConnected);

    if (!currentTerminal || !currentIsConnected) {
      console.log("Terminal not ready - terminal:", !!currentTerminal, "isConnected:", currentIsConnected);
      return;
    }

    try {
      // Display the command that was executed
      currentTerminal.write(`\r\n$ ${command}\r\n`);
      
      const result = await executeTerminalCommand(command.trim());
      console.log("Client: Received result:", result);

      // Check if terminal is still available after async operation
      if (!terminalInstanceRef.current) {
        console.log("Terminal was disposed during command execution");
        return;
      }

      if (result.success) {
        console.log("Client: Writing output:", result.output);
        // Process output to handle long lines better
        const output = result.output || "";
        terminalInstanceRef.current.write(output);
        console.log("Client: Output written to terminal");
      } else {
        console.log("Client: Command failed with exit code:", result.exitCode);
        terminalInstanceRef.current.write(
          `\x1b[31mCommand failed with exit code: ${result.exitCode}\x1b[0m`
        );
        if (result.output) {
          terminalInstanceRef.current.write(`\r\n${result.output}`);
        }
      }
      terminalInstanceRef.current.write("\r\n$ ");
      
      // Auto-scroll to bottom after command execution
      setTimeout(() => {
        if (terminalInstanceRef.current) {
          terminalInstanceRef.current.scrollToBottom();
        }
      }, 100);
      console.log("Client: Prompt written to terminal");

      // Add to command history
      commandHistory.current.push(command);
      historyIndex.current = commandHistory.current.length;
    } catch (error) {
      console.error("Error executing command:", error);
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.write(
          `\r\n\x1b[31mError executing command: ${error}\x1b[0m\r\n$ `
        );
      }
    }
  }, []);

  const initializeTerminal = async () => {
    console.log("Initializing terminal...");
    if (!terminalRef.current) {
      console.log("Terminal ref not available");
      return;
    }

    try {
      console.log("Loading xterm modules...");
      // Dynamically import xterm modules to avoid SSR issues
      const [{ Terminal }, { FitAddon }, { WebLinksAddon }] = await Promise.all(
        [
          import("@xterm/xterm"),
          import("@xterm/addon-fit"),
          import("@xterm/addon-web-links"),
        ]
      );

      console.log("Creating terminal instance...");
      const validatedConfig = terminalConfigSchema.parse(config);

      const term = new Terminal({
        cols: validatedConfig.cols,
        rows: validatedConfig.rows,
        theme: terminalThemes[validatedConfig.theme],
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        fontSize: 13,
        fontWeight: "normal",
        lineHeight: 1.2,
        letterSpacing: 0,
        cursorBlink: true,
        cursorStyle: "block",
        allowTransparency: true,
        scrollback: 10000, // Increased scrollback for large outputs
        tabStopWidth: 4,
        scrollSensitivity: 1,
        fastScrollSensitivity: 5,
        fastScrollModifier: 'alt',
        convertEol: true, // Convert \n to \r\n automatically
      });

      console.log("Setting up terminal addons...");
      fitAddon.current = new FitAddon();
      term.loadAddon(fitAddon.current);
      term.loadAddon(new WebLinksAddon());

      console.log("Opening terminal...");
      term.open(terminalRef.current);
      fitAddon.current.fit();

      console.log("Setting up terminal event handlers...");
      // Handle user input
      term.onData((data) => {
        const code = data.charCodeAt(0);

        if (code === 13) {
          // Enter key
          executeCommand(currentLine.current);
          currentLine.current = "";
        } else if (code === 127) {
          // Backspace
          if (currentLine.current.length > 0) {
            currentLine.current = currentLine.current.slice(0, -1);
            term.write("\b \b");
          }
        } else if (code === 27) {
          // Escape sequences (arrow keys)
          const sequence = data.slice(1);
          if (sequence === "[A") {
            // Up arrow
            if (historyIndex.current > 0) {
              historyIndex.current--;
              const command = commandHistory.current[historyIndex.current];
              // Clear current line and write command
              term.write("\r$ " + command);
              currentLine.current = command;
            }
          } else if (sequence === "[B") {
            // Down arrow
            if (historyIndex.current < commandHistory.current.length - 1) {
              historyIndex.current++;
              const command = commandHistory.current[historyIndex.current];
              term.write("\r$ " + command);
              currentLine.current = command;
            } else {
              historyIndex.current = commandHistory.current.length;
              term.write("\r$ ");
              currentLine.current = "";
            }
          }
        } else if (code >= 32) {
          // Printable characters
          currentLine.current += data;
          term.write(data);
        }
      });

      console.log("Setting terminal state...");
      // Update both state and ref
      setTerminal(term);
      terminalInstanceRef.current = term;
      console.log("Terminal initialized successfully");
      return term;
    } catch (error) {
      console.error("Terminal initialization error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to initialize terminal"
      );
    }
  };

  const connectTerminal = async () => {
    console.log("connectTerminal called, terminal:", !!terminal);
    if (!terminalInstanceRef.current) {
      console.log("Terminal not available for connection");
      return;
    }

    console.log("Starting terminal connection...");
    setIsLoading(true);
    setError(null);

    try {
      console.log("Creating terminal session...");
      const result = await createTerminalSession();
      console.log("Session creation result:", result);

      if (result.success) {
        console.log("Session created successfully, setting up terminal...");
        setSessionId(result.sessionId);
        setIsConnected(true);
        isConnectedRef.current = true; // Update ref immediately
        
        terminalInstanceRef.current.clear();
        terminalInstanceRef.current.write("\x1b[32m✓ Terminal session created\x1b[0m\r\n");
        terminalInstanceRef.current.write(`\x1b[36m${result.initialOutput}\x1b[0m`);
        console.log("Terminal connected successfully");
      } else {
        console.log("Session creation failed");
        setError("Failed to create terminal session");
      }

    } catch (error) {
      console.error("Connection error:", error);
      setError(error instanceof Error ? error.message : "Connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectTerminal = () => {
    setIsConnected(false);
    isConnectedRef.current = false; // Update ref immediately
    setSessionId(null);
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.clear();
      terminalInstanceRef.current.write("\x1b[31mTerminal disconnected\x1b[0m\r\n");
    }
  };

  const resizeTerminal = () => {
    if (fitAddon.current) {
      fitAddon.current.fit();
    }
  };

  const clearTerminal = () => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.clear();
      terminalInstanceRef.current.write("$ ");
      currentLine.current = "";
    }
  };

  useEffect(() => {
    console.log("useEffect: Initializing terminal");
    initializeTerminal();

    return () => {
      console.log("useEffect cleanup: Disposing terminal");
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.dispose();
        terminalInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (terminalInstanceRef.current && config.theme) {
      terminalInstanceRef.current.options.theme = terminalThemes[config.theme];
    }
  }, [config.theme]);

  useEffect(() => {
    const handleResize = () => {
      resizeTerminal();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    terminalRef,
    terminal,
    isConnected,
    isLoading,
    error,
    connectTerminal,
    disconnectTerminal,
    resizeTerminal,
    clearTerminal,
  };
};