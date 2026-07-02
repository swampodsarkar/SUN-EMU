import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Play, Smartphone, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const FEATURED_GAMES = [
  { name: "Super Mario Bros", platform: "NES", color: "#e11d48", icon: "🍄" },
  { name: "Pokemon Emerald", platform: "GBA", color: "#059669", icon: "⚡" },
  { name: "Sonic the Hedgehog", platform: "Genesis", color: "#0284c7", icon: "💙" },
  { name: "Final Fantasy VII", platform: "PSX", color: "#7c3aed", icon: "⚔️" },
  { name: "The Legend of Zelda", platform: "NES", color: "#d97706", icon: "🗡️" },
  { name: "Super Metroid", platform: "SNES", color: "#be123c", icon: "🚀" },
  { name: "Crash Bandicoot", platform: "PSX", color: "#ea580c", icon: "🦊" },
  { name: "Mega Man X", platform: "SNES", color: "#2563eb", icon: "🤖" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full bg-[#0a0a1a] flex flex-col overflow-hidden font-sans relative">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,112,209,0.12)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(0,112,209,0.06)_0%,transparent_70%)]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0070d1] flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-bold tracking-wide text-white/90">SUN EMU</span>
        </div>
        <div className="flex items-center gap-4 text-white/50 text-xs font-medium">
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative z-10 flex-1 flex flex-col px-8 md:px-16 pt-8 pb-4 min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col justify-center max-w-2xl min-h-0"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0070d1] shadow-[0_0_8px_rgba(0,112,209,0.8)]" />
            <span className="text-xs font-semibold text-[#0070d1] tracking-[0.2em] uppercase">Retro Gaming Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-[0.95] tracking-tight">
            <span className="text-white">Play Anywhere.</span><br />
            <span className="text-[#0070d1]">Any Console.</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg mb-8 max-w-md leading-relaxed font-light">
            NES, SNES, GBA, PSX, Genesis and more. Load your ROMs and start playing instantly in your browser.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/os')}
              className="group bg-[#0070d1] hover:bg-[#0090ff] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center gap-3 shadow-[0_0_30px_rgba(0,112,209,0.3)] hover:shadow-[0_0_50px_rgba(0,112,209,0.5)] active:scale-95"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Start Playing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/os')}
              className="text-white/60 hover:text-white px-6 py-4 rounded-xl font-medium text-sm transition-all flex items-center gap-2 border border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              <Smartphone className="w-4 h-4" />
              Connect Controller
            </button>
          </div>
        </motion.div>
      </div>

      {/* Featured Games Row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 px-8 md:px-16 pb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold text-white/40 tracking-[0.2em] uppercase">Featured Games</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {FEATURED_GAMES.map((game, i) => (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              onClick={() => navigate('/os')}
              className="ps5-card-hover flex-shrink-0 w-40 h-52 rounded-2xl overflow-hidden cursor-pointer relative group"
              style={{ background: `linear-gradient(135deg, ${game.color}22, ${game.color}08)` }}
            >
              <div className="absolute inset-0 border border-white/5 rounded-2xl group-hover:border-white/15 transition-colors" />
              <div className="absolute top-4 left-4 text-3xl">{game.icon}</div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-[10px] font-bold text-white/40 tracking-wider uppercase mb-1">{game.platform}</div>
                <div className="text-xs font-semibold text-white/90 leading-tight">{game.name}</div>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
