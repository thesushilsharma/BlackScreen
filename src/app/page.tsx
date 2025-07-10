import { TerminalEmulator } from "@/components/terminal-emulator";

export default function Home() {
  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Web Terminal Emulator
            </h1>
            <p className="text-slate-300 text-lg">
              Full-featured terminal in your browser with real-time WebSocket communication
            </p>
          </div>
          
          <div className="w-full h-[calc(100vh-200px)]">
            <TerminalEmulator />
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Next.js 15 + TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>xterm.js + WebSockets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>Real-time Communication</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
