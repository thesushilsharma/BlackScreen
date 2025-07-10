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
  Settings,
  Copy,
  Palette,
  Monitor,
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
  const [terminalConfig, setTerminalConfig] = useState({
    cols: 80,
    rows: 24,
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

  useEffect(() => {
    setTerminalConfig((prev) => ({ ...prev, theme }));
  }, [theme]);

  useEffect(() => {
    // Auto-connect when component mounts
    if (!isConnected && !isLoading) {
      connectTerminal();
    }
  }, []);

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
    }, 100);
  };

  const handleCopy = () => {
    if (terminal) {
      const selection = terminal.getSelection();
      if (selection) {
        navigator.clipboard.writeText(selection);
      }
    }
  };

  const statusColor = isConnected
    ? "bg-green-500"
    : isLoading
    ? "bg-yellow-500"
    : "bg-red-500";
  const statusText = isConnected
    ? "Connected"
    : isLoading
    ? "Connecting..."
    : "Disconnected";

  return (
    <TooltipProvider>
      <div
        className={cn(
          "w-full h-full flex flex-col",
          isFullscreen && "fixed inset-0 z-50 bg-background",
          className
        )}
      >
        <Card className="flex-1 flex flex-col border-2 border-border/50 shadow-2xl">
          <CardHeader className="px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-lg">Terminal</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", statusColor)} />
                  <span className="text-sm font-medium">{statusText}</span>
                  {error && (
                    <Badge variant="destructive" className="text-xs">
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
                  <SelectTrigger className="w-32 h-8">
                    <Palette className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="matrix">Matrix</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                  </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-6" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      disabled={!isConnected}
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
                    >
                      <RefreshCw className="w-4 h-4" />
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
                    >
                      {isConnected ? (
                        <PowerOff className="w-4 h-4" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isConnected ? "Disconnect" : "Connect"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            {error && (
              <div className="bg-destructive/10 border-l-4 border-destructive p-4 text-destructive text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div
              ref={terminalRef}
              className="w-full h-full bg-black/95 focus:outline-none"
              style={{
                minHeight: isFullscreen ? "calc(100vh - 140px)" : "500px",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
