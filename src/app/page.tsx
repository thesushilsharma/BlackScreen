import { TerminalEmulator } from "@/components/terminal-emulator";
import { Terminal, Code, Zap, Globe, Shield, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.1)_50%,transparent_75%)] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        {/* <header className="px-4 pt-6 pb-2">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <Terminal className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Web Terminal Emulator
              </h1>
            </div>
            <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Full-featured terminal emulator with real-time command execution, 
              multiple themes, and seamless browser integration
            </p>
          </div>
        </header> */}

        {/* Main terminal area */}
        <main className="flex-1 px-4 pb-4">
          <div className="max-w-7xl mx-auto h-full">
            <div className="h-full max-h-[calc(100vh-220px)]">
              <TerminalEmulator className="h-full" />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Features */}
            {/* <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-medium">Next.js 15</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="font-medium">TypeScript</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="font-medium">xterm.js</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                <span className="font-medium">Real-time</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                <span className="font-medium">Responsive</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
                <span className="font-medium">Multi-theme</span>
              </div>
            </div> */}

            {/* Quick tips */}
            {/* <div className="text-center">
              <div className="inline-flex items-center gap-6 text-xs text-slate-500 bg-slate-800/30 rounded-full px-6 py-3 backdrop-blur-sm border border-slate-700/30">
                <div className="flex items-center gap-2">
                  <Code className="w-3 h-3" />
                  <span>Use arrow keys for command history</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  <span>Ctrl+C to interrupt commands</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  <span>Try: dir, pwd, whoami, echo</span>
                </div>
              </div>
            </div> */}
          </div>
        </footer>
      </div>
    </div>
  );
}