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
  
  React.useEffect(() => {
    if (isPlaying && iframeRef.current) {
      // Focus iframe so keyboard events are captured by emulator
      iframeRef.current.focus();
    }
  }, [isPlaying, iframeRef]);

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
    <div className="w-full h-full bg-black overflow-hidden relative">
      <iframe
        ref={iframeRef}
        src="/emulator.html"
        onLoad={handleIframeLoad}
        className="absolute inset-0 w-full h-full border-0 block"
        title="Emulator Game"
        allow="gamepad; autoplay"
      />
    </div>
  );
}
