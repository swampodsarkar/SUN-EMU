import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden font-sans text-white">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-indigo-500/20 border border-indigo-500/30 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
          <Gamepad2 className="w-12 h-12 text-indigo-400" />
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent text-center">
          Sun Emulator
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-lg text-center leading-relaxed">
          The ultimate web-based retro gaming platform. Turn your phone into a wireless controller instantly.
        </p>
        
        <button 
          onClick={() => navigate('/os')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] flex items-center gap-3 hover:-translate-y-1 active:scale-95"
        >
          <Zap className="w-6 h-6" />
          Launch Sun Emulator
        </button>
      </motion.div>
    </div>
  );
}
