import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="h-full w-full bg-[#050510] flex flex-col items-center justify-center font-sans relative overflow-hidden cursor-pointer"
      onClick={() => navigate('/os')}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,114,206,0.08)_0%,transparent_70%)]" />
      </div>

      {!booted ? (
        <motion.div
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="w-28 h-28 rounded-[32px] bg-gradient-to-br from-[#0072ce]/20 to-[#0072ce]/5 border border-[#0072ce]/15 flex items-center justify-center shadow-[0_0_80px_rgba(0,114,206,0.1)]">
            <Gamepad2 className="w-14 h-14 text-[#0072ce]/70" />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[#0072ce]/15 to-[#0072ce]/5 border border-[#0072ce]/15 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(0,114,206,0.08)]">
            <Gamepad2 className="w-12 h-12 text-[#0072ce]" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3 tracking-tight">Sun Emulator</h1>
          <p className="text-white/20 text-sm font-medium tracking-wide">Press any button to start</p>

          <motion.div
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-12"
          >
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0072ce]/40" />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
