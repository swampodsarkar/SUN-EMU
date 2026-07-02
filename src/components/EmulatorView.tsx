import React, { useState, useCallback, useEffect, useRef } from "react";
import { Gamepad2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function EmulatorView({
  isPlaying,
  iframeRef,
  romKey,
  sendStartEmulator,
  gameName,
  onBack,
}: any) {
  const [showUI, setShowUI] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showQuit, setShowQuit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wasFsRef = useRef(false);

  const resetTimer = useCallback(() => {
    setShowUI(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowUI(false), 3000);
  }, []);

  const enterFullscreen = useCallback(() => {
    if (containerRef.current && !document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        wasFsRef.current = true;
      }).catch(() => {});
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      resetTimer();
      enterFullscreen();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying]);

  // Intercept ESC / fullscreen exit → show quit popup instead of mini window
  useEffect(() => {
    const onFSChange = () => {
      if (!document.fullscreenElement && isPlaying && !showQuit) {
        setShowQuit(true);
      }
    };
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, [isPlaying, showQuit]);

  const handleCancelQuit = () => {
    setShowQuit(false);
    enterFullscreen();
  };

  const handleConfirmQuit = () => {
    wasFsRef.current = false;
    exitFullscreen();
    onBack();
  };

  if (!isPlaying) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050510] text-white/20">
        <Gamepad2 className="w-16 h-16 mb-4" />
        <p className="text-sm font-medium">No game loaded</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black"
      onMouseMove={resetTimer}
      onMouseLeave={() => setShowUI(true)}
      onTouchStart={resetTimer}
    >
      <iframe
        key={romKey}
        ref={iframeRef}
        src="/emulator.html"
        className="w-full h-full border-0"
        title="Emulator Game"
        allow="gamepad; autoplay"
        onLoad={sendStartEmulator}
      />

      <AnimatePresence>
        {showUI && !showQuit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-50"
          >
            <div className="bg-gradient-to-b from-black/70 via-black/30 to-transparent pt-4 pb-10 px-6">
              <div className="flex items-center justify-between max-w-5xl mx-auto">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowQuit(true)}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                      </svg>
                    </div>
                    <span className="text-xs font-medium">Back</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40 font-medium truncate max-w-[200px]">{gameName}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUI && !showQuit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 z-50"
          >
            <div className="bg-gradient-to-t from-black/60 via-black/20 to-transparent pt-10 pb-5 px-6">
              <div className="flex items-center justify-center gap-4 text-white/15 text-[10px] font-medium">
                <div className="flex items-center gap-1.5">
                  <Circle className="w-3 h-3" />
                  <span>PS</span>
                </div>
                <span className="opacity-30">•</span>
                <span>Controls</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQuit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111128] border border-white/8 rounded-3xl p-8 w-full max-w-sm mx-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5">
                <Gamepad2 className="w-8 h-8 text-white/40" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Close Game?</h2>
              <p className="text-sm text-white/30 mb-8">Press ESC again or confirm to close.</p>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleConfirmQuit}
                  className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm py-3.5 rounded-2xl transition-colors"
                >
                  Close Game
                </button>
                <button
                  onClick={handleCancelQuit}
                  className="w-full text-white/40 hover:text-white/60 font-medium text-sm py-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
