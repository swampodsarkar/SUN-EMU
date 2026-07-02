import React, { useState, useRef, useEffect } from 'react';
import { Settings, Search, User, Play, Plus, Smartphone, Monitor, Clock, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEmulatorSession } from '../lib/useEmulatorSession';
import type { SupportedCore } from '../types';
import { cn } from '../lib/utils';
import EmulatorView from './EmulatorView';

const coreExtensions: Record<string, SupportedCore> = {
  ".nes": "nes", ".smc": "snes", ".sfc": "snes", ".gb": "gb", ".gbc": "gbc",
  ".gba": "gba", ".nds": "nds", ".md": "segaMD", ".gen": "segaMD", ".sms": "sms",
  ".gg": "gg", ".iso": "psx", ".bin": "psx", ".a26": "atari2600", ".zip": "arcade",
};

interface AppItem {
  id: string;
  title: string;
  subtitle: string;
  bgImage: string;
  icon: React.ReactNode;
  action?: () => void;
  type: 'game' | 'app';
}

export default function OSView() {
  const session = useEmulatorSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const detectedCore = coreExtensions[ext];

    if (!detectedCore) {
      alert("Unsupported file format or core not detected automatically.");
      return;
    }

    const url = URL.createObjectURL(file);
    session.setGameUrl(url);
    session.setCore(detectedCore);
    session.setGameName(file.name.replace(ext, ''));
    
    // Automatically focus the new game (it will be index 0)
    setActiveIndex(0);
  };

  const apps: AppItem[] = [
    ...(session.gameUrl ? [{
      id: 'active-game',
      title: session.gameName || 'Loaded Game',
      subtitle: 'Currently Loaded ROM',
      bgImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2574&auto=format&fit=crop',
      icon: <Play className="w-8 h-8 text-white" />,
      action: () => session.setIsPlaying(true),
      type: 'game' as const
    }] : []),
    {
      id: 'load-rom',
      title: 'Load Game',
      subtitle: 'Browse for ROM files (.nes, .gba, .iso, etc.)',
      bgImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop',
      icon: <Upload className="w-8 h-8 text-white" />,
      action: () => fileInputRef.current?.click(),
      type: 'app'
    },
    {
      id: 'controller',
      title: 'Controller Setup',
      subtitle: `Pair Code: ${session.pairCode || 'Loading...'}`,
      bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2574&auto=format&fit=crop',
      icon: <Smartphone className="w-8 h-8 text-white" />,
      type: 'app'
    }
  ];

  const activeApp = apps[activeIndex];

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden flex flex-col font-sans relative selection:bg-white/30">
      
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeApp.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${activeApp.bgImage})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between px-12 py-8">
        <div className="flex items-center gap-8">
          <span className="text-xl font-medium cursor-pointer text-white border-b-2 border-white pb-1">Games</span>
          <span className="text-xl font-medium cursor-pointer text-white/50 hover:text-white/80 transition-colors pb-1">Media</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 text-white/80 cursor-pointer hover:text-white transition-colors" />
          <Settings className="w-5 h-5 text-white/80 cursor-pointer hover:text-white transition-colors" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center cursor-pointer ring-2 ring-white/20 hover:ring-white transition-all">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-medium opacity-90">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-12 pb-16">
        
        {/* Game Title & Info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeApp.id}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.3 }}
            className="mb-8 max-w-xl"
          >
            <h1 className="text-5xl font-bold tracking-tight mb-3 drop-shadow-lg text-white">
              {activeApp.title}
            </h1>
            <p className="text-xl text-white/70 drop-shadow-md mb-8">
              {activeApp.subtitle}
            </p>

            {activeApp.action && (
              <button 
                onClick={activeApp.action}
                className="bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-3 border border-white/20 hover:scale-105 active:scale-95 group"
              >
                {activeApp.type === 'game' ? (
                  <Play className="w-5 h-5 fill-current" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                {activeApp.type === 'game' ? 'Play Game' : 'Open'}
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Horizontal App List */}
        <div className="flex gap-4 items-center">
          {apps.map((app, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={app.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative group transition-all duration-300 ease-out focus:outline-none flex-shrink-0",
                  isActive ? "w-32 h-32 scale-110 z-20 mx-2" : "w-24 h-24 opacity-60 hover:opacity-100 z-10 hover:scale-105"
                )}
              >
                <div className={cn(
                  "w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl overflow-hidden",
                  isActive ? "ring-4 ring-white shadow-[0_0_40px_rgba(255,255,255,0.2)]" : "ring-1 ring-white/20"
                )}>
                  {/* Tile Background */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${app.bgImage})` }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  
                  {/* Icon */}
                  <div className="relative z-10 drop-shadow-xl">
                    {app.icon}
                  </div>
                </div>
                
                {/* Active Indicator Bounce */}
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept=".nes,.smc,.sfc,.gb,.gbc,.gba,.nds,.md,.gen,.sms,.gg,.iso,.bin,.a26,.zip"
      />

      {/* Emulator Overlay */}
      <AnimatePresence>
        {session.isPlaying && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            <div className="absolute top-4 right-4 z-50">
              <button 
                onClick={() => session.setIsPlaying(false)}
                className="bg-black/50 hover:bg-red-500/80 text-white p-3 rounded-full backdrop-blur-md border border-white/10 transition-all shadow-lg group"
                title="Exit Game"
              >
                <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <EmulatorView 
              isWindowed={false} 
              isPlaying={session.isPlaying} 
              iframeRef={session.iframeRef} 
              gameUrl={session.gameUrl}
              core={session.core}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
