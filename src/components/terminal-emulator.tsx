"use client";

import { useState, useEffect } from "react";
import { useTerminal } from "@/hooks/use-terminal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Terminal,
  Power,
  PowerOff,
  Maximize2,
  Minimize2,
  RefreshCw,
  Copy,
  Palette,
  Monitor,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalEmulatorProps {
  className?: string;
}

export function TerminalEmulator({ className }: TerminalEmulatorProps) {
  const [theme, setTheme] = useState<"dark" | "light" | "matrix" | "ocean">(
    "dark"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [terminalSize, setTerminalSize] = useState({
    cols: 120,
    rows: 30,
  });
  const [terminalConfig, setTerminalConfig] = useState({
    cols: terminalSize.cols,
    rows: terminalSize.rows,
    theme: theme,
  });

  const {
    terminalRef,
    terminal,
    isConnected,
    isLoading,
    error,
    connectTerminal,
    disconnectTerminal,
    resizeTerminal,
    clearTerminal,
  } = useTerminal(terminalConfig);

  // Auto-calculate terminal size based on viewport
  useEffect(() => {
    const calculateTerminalSize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate optimal columns and rows based on viewport
      const charWidth = 8.4; // Approximate character width in pixels
      const charHeight = 17; // Approximate character height in pixels
      
      const availableWidth = viewportWidth - (isFullscreen ? 80 : 120); // Account for padding
      const availableHeight = (isFullscreen ? viewportHeight - 140 : Math.min(viewportHeight - 300, 600));
      
      const cols = Math.floor(availableWidth / charWidth);
      const rows = Math.floor(availableHeight / charHeight);
      
      setTerminalSize({
        cols: Math.max(80, Math.min(cols, 150)), // Min 80, Max 150
        rows: Math.max(20, Math.min(rows, 50)),  // Min 20, Max 50
      });
    };

    calculateTerminalSize();
    window.addEventListener('resize', calculateTerminalSize);
    return () => window.removeEventListener('resize', calculateTerminalSize);
  }, [isFullscreen]);

  useEffect(() => {
    setTerminalConfig(prev => ({
      ...prev,
      theme,
      cols: terminalSize.cols,
      rows: terminalSize.rows,
    }));
  }, [theme, terminalSize]);

  useEffect(() => {
    // Auto-connect when terminal is initialized and not already connected
    if (terminal && !isConnected && !isLoading) {
      connectTerminal();
    }
  }, [terminal, isConnected, isLoading]);

  const handleConnect = () => {
    if (isConnected) {
      disconnectTerminal();
    } else {
      connectTerminal();
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Resize terminal after fullscreen toggle
    setTimeout(() => {
      resizeTerminal();
    }, 150);
  };

  const handleCopy = async () => {
    if (terminal) {
      const selection = terminal.getSelection();
      if (selection) {
        try {
          await navigator.clipboard.writeText(selection);
          // You could add a toast notification here
        } catch (err) {
          console.error('Failed to copy text:', err);
        }
      }
    }
  };

  const scrollToTop = () => {
    if (terminal) {
      terminal.scrollToTop();
    }
  };

  const scrollToBottom = () => {
    if (terminal) {
      terminal.scrollToBottom();
    }
  };

  const statusColor = isConnected
    ? "bg-green-500 animate-pulse"
    : isLoading
    ? "bg-yellow-500 animate-pulse"
    : "bg-red-500";
  const statusText = isConnected
    ? "Connected"
    : isLoading
    ? "Connecting..."
    : "Disconnected";

  const themeColors = {
    dark: "from-gray-900 to-gray-800",
    light: "from-gray-100 to-white",
    matrix: "from-black to-green-900",
    ocean: "from-blue-900 to-blue-800",
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "w-full h-full flex flex-col transition-all duration-300",
          isFullscreen && "fixed inset-0 z-50 bg-background p-4",
          className
        )}
      >
        <Card className={cn(
          "flex-1 flex flex-col border-2 shadow-2xl backdrop-blur-sm",
          "bg-gradient-to-br", themeColors[theme],
          "border-border/30 hover:border-border/50 transition-all duration-300"
        )}>
          <CardHeader className="px-6 py-4 border-b bg-background/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Terminal className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Terminal Emulator</h2>
                    <p className="text-xs text-muted-foreground">
                      {terminalSize.cols}×{terminalSize.rows} • {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </p>
                  </div>
                </div>
                
                <Separator orientation="vertical" className="h-10" />
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", statusColor)} />
                    <span className="text-sm font-medium">{statusText}</span>
                  </div>
                  {error && (
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      <Zap className="w-3 h-3 mr-1" />
                      Error
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={theme}
                  onValueChange={(value: any) => setTheme(value)}
                >
                  <SelectTrigger className="w-36 h-9 bg-background/50">
                    <Palette className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">🌙 Dark</SelectItem>
                    <SelectItem value="light">☀️ Light</SelectItem>
                    <SelectItem value="matrix">🔋 Matrix</SelectItem>
                    <SelectItem value="ocean">🌊 Ocean</SelectItem>
                  </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={scrollToTop}
                        disabled={!isConnected}
                        className="h-9 w-9"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Scroll to Top</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={scrollToBottom}
                        disabled={!isConnected}
                        className="h-9 w-9"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Scroll to Bottom</TooltipContent>
                  </Tooltip>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      disabled={!isConnected}
                      className="h-9 w-9"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy Selection</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearTerminal}
                      disabled={!isConnected}
                      className="h-9 w-9"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear Terminal</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFullscreen}
                      className="h-9 w-9"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-4 h-4" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isConnected ? "destructive" : "default"}
                      size="sm"
                      onClick={handleConnect}
                      disabled={isLoading}
                      className="h-9 px-4"
                    >
                      {isConnected ? (
                        <>
                          <PowerOff className="w-4 h-4 mr-2" />
                          Disconnect
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isConnected ? "Disconnect Terminal" : "Connect Terminal"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden relative">
            {error && (
              <div className="absolute top-0 left-0 right-0 z-10 bg-destructive/10 border-l-4 border-destructive p-4 text-destructive text-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}

            <div
              ref={terminalRef}
              className={cn(
                "w-full h-full focus:outline-none transition-all duration-300",
                "bg-gradient-to-br from-black/95 to-black/90",
                error && "mt-16"
              )}
              style={{
                minHeight: isFullscreen ? "calc(100vh - 200px)" : "500px",
                maxHeight: isFullscreen ? "calc(100vh - 200px)" : "70vh",
              }}
            />

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="flex items-center gap-3 text-lg">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to terminal...</span>
                </div>
              </div>
            )}

            {/* Terminal info overlay */}
            {!isLoading && !isConnected && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Monitor className="w-16 h-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Terminal Ready</h3>
                    <p className="text-muted-foreground mb-4">
                      Click connect to start your terminal session
                    </p>
                    <Button onClick={handleConnect} className="px-6">
                      <Power className="w-4 h-4 mr-2" />
                      Connect Terminal
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Terminal info footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Terminal Size: {terminalSize.cols}×{terminalSize.rows}</span>
            <span>Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
            <span>Status: {statusText}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Press Ctrl+C to interrupt • Use arrow keys for history</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}