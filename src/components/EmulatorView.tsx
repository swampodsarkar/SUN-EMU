import React, { useState } from "react";
import { ArrowLeft, Gamepad2, Maximize, Pause, Volume2 } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function EmulatorView({
  isPlaying,
  iframeRef,
  romKey,
  sendStartEmulator,
  gameName,
  onBack,
}: any) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayTimeout, setOverlayTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = () => {
    setShowOverlay(true);
    if (overlayTimeout) clearTimeout(overlayTimeout);
    const timeout = setTimeout(() => setShowOverlay(false), 3000);
    setOverlayTimeout(timeout);
  };

  if (!isPlaying) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-[#0a0a1a] text-white/40">
        <Gamepad2 className="w-16 h-16 text-white/10 mb-4" />
        <p className="text-sm font-medium">No game loaded</p>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full bg-black relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowOverlay(true)}
    >
      {/* Emulator Iframe */}
      <iframe
        key={romKey}
        ref={iframeRef}
        src="/emulator.html"
        className="w-full h-full border-0"
        title="Emulator Game"
        allow="gamepad; autoplay"
        onLoad={sendStartEmulator}
      />

      {/* PS5-style Top Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-0 right-0 z-50"
          >
            <div className="bg-gradient-to-b from-black/80 via-black/40 to-transparent pt-4 pb-8 px-6">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Back</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white/50">{gameName}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/60 hover:text-white">
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/60 hover:text-white">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PS5-style Bottom Controls Hint */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 z-50"
          >
            <div className="bg-gradient-to-t from-black/60 via-black/30 to-transparent pt-8 pb-4 px-6">
              <div className="flex items-center justify-center gap-6 text-white/30 text-[10px] font-medium tracking-wider">
                <span>← → ↑ ↓  D-PAD</span>
                <span>•</span>
                <span>Z  A  •  X  B</span>
                <span>•</span>
                <span>ENTER  START</span>
                <span>•</span>
                <span>SHIFT  SELECT</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
