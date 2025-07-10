"use client";

import { useEffect, useRef, useState } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import {
  terminalConfigSchema,
  terminalInputSchema,
  terminalResizeSchema,
} from "@/lib/terminal-validation";
import type { TerminalConfig } from "@/lib/terminal-validation";
import type { Terminal } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";

export const useTerminal = (config: TerminalConfig) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const socket = useRef<any>(null);

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

  const initializeTerminal = async () => {
    if (!terminalRef.current) return;

    // Dynamically import xterm modules to avoid SSR issues
    const [{ Terminal }, { FitAddon }, { WebLinksAddon }] = await Promise.all([
      import("@xterm/xterm"),
      import("@xterm/addon-fit"),
      import("@xterm/addon-web-links"),
    ]);

    const validatedConfig = terminalConfigSchema.parse(config);

    const term = new Terminal({
      cols: validatedConfig.cols,
      rows: validatedConfig.rows,
      theme: terminalThemes[validatedConfig.theme],
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      fontSize: 14,
      fontWeight: "normal",
      lineHeight: 1.2,
      letterSpacing: 0,
      cursorBlink: true,
      cursorStyle: "block",
      allowTransparency: true,
      scrollback: 1000,
      tabStopWidth: 4,
    });

    fitAddon.current = new FitAddon();
    term.loadAddon(fitAddon.current);
    term.loadAddon(new WebLinksAddon());

    term.open(terminalRef.current);
    fitAddon.current.fit();

    setTerminal(term);
    return term;
  };

  const connectTerminal = async () => {
    if (!terminal) return;

    setIsLoading(true);
    setError(null);

    try {
      socket.current = connectSocket();

      socket.current.on("connect", () => {
        setIsConnected(true);
        setIsLoading(false);

        const validatedConfig = terminalConfigSchema.parse(config);
        socket.current.emit("create-terminal", validatedConfig);
      });

      socket.current.on("disconnect", () => {
        setIsConnected(false);
      });

      socket.current.on("terminal-created", (data: any) => {
        terminal.write("\x1b[2J\x1b[H"); // Clear screen
        terminal.write(`\x1b[32m✓ Terminal session created\x1b[0m\r\n`);
        terminal.write(`\x1b[36mShell: ${data.shell}\x1b[0m\r\n`);
        terminal.write(`\x1b[36mCWD: ${data.cwd}\x1b[0m\r\n\r\n`);
      });

      socket.current.on("terminal-data", (data: string) => {
        terminal.write(data);
      });

      socket.current.on("terminal-exit", (data: any) => {
        terminal.write(
          `\r\n\x1b[31mTerminal exited with code: ${data.code}\x1b[0m\r\n`
        );
        setIsConnected(false);
      });

      socket.current.on("terminal-error", (data: any) => {
        setError(data.message);
        setIsLoading(false);
      });

      terminal.onData((data: string) => {
        if (socket.current && socket.current.connected) {
          const validated = terminalInputSchema.parse({ data });
          socket.current.emit("terminal-input", validated.data);
        }
      });

      terminal.onResize(({ cols, rows }) => {
        if (socket.current && socket.current.connected) {
          const validated = terminalResizeSchema.parse({ cols, rows });
          socket.current.emit("terminal-resize", validated);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
      setIsLoading(false);
    }
  };

  const disconnectTerminal = () => {
    if (socket.current) {
      disconnectSocket();
      setIsConnected(false);
    }
  };

  const resizeTerminal = () => {
    if (fitAddon.current) {
      fitAddon.current.fit();
    }
  };

  const clearTerminal = () => {
    if (terminal) {
      terminal.clear();
    }
  };

  useEffect(() => {
    const initTerminal = async () => {
      const term = await initializeTerminal();
    };

    initTerminal();

    return () => {
      if (terminal) {
        terminal.dispose();
      }
      disconnectTerminal();
    };
  }, [config]);

  useEffect(() => {
    if (terminal && config.theme) {
      terminal.options.theme = terminalThemes[config.theme];
    }
  }, [terminal, config.theme]);

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
