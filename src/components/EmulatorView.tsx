import React from "react";
import { Gamepad2 } from "lucide-react";
import { cn } from "../lib/utils";

export default function EmulatorView({ 
  isWindowed, 
  isPlaying, 
  iframeRef,
  gameUrl,
  core
}: any) {
  
  if (!isPlaying) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center bg-[#020617] text-slate-400 font-sans p-8 text-center",
        isWindowed ? "h-full w-full" : "min-h-screen"
      )}>
        <Gamepad2 className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Sun Emulator Ready</h2>
        <p>Please load a ROM using the File Explorer.</p>
      </div>
    );
  }

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    if (isPlaying && gameUrl && core && e.currentTarget.contentWindow) {
      e.currentTarget.contentWindow.postMessage({
        type: 'START_EMULATOR',
        core: core,
        gameUrl: gameUrl
      }, '*');
    }
  };

  return (
    <div className={cn(
      "flex flex-col bg-[#020617] text-slate-100 relative overflow-hidden font-sans",
      isWindowed ? "h-full w-full" : "min-h-screen"
    )}>
      {/* Background glowing effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center p-0 z-10 w-full h-full">
        <div className="w-full h-full flex flex-col min-w-0">
          <div className="w-full h-full bg-black overflow-hidden relative flex-1">
            <iframe
              ref={iframeRef}
              src="/emulator.html"
              onLoad={handleIframeLoad}
              className="w-full h-full border-0"
              title="Emulator Game"
              allow="gamepad; autoplay"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
