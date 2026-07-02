import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, FolderOpen, Smartphone, Play, Search, Settings, ChevronLeft, ChevronRight, Trophy, Star, ArrowUp, ArrowDown } from 'lucide-react';
import EmulatorView from './EmulatorView';
import FileExplorerApp from './FileExplorerApp';
import ControllerApp from './ControllerApp';
import { useEmulatorSession } from '../lib/useEmulatorSession';
import { motion, AnimatePresence } from 'motion/react';

type View = 'home' | 'library' | 'controller' | 'emulator';

const PLATFORMS = [
  { id: 'nes', label: 'NES', icon: '🍄', color: '#e11d48', desc: 'Nintendo Entertainment System', year: '1983', dev: 'Nintendo' },
  { id: 'snes', label: 'SNES', icon: '🗡️', color: '#7c3aed', desc: 'Super Nintendo', year: '1990', dev: 'Nintendo' },
  { id: 'gba', label: 'GBA', icon: '⚡', color: '#0284c7', desc: 'Game Boy Advance', year: '2001', dev: 'Nintendo' },
  { id: 'gb', label: 'GB', icon: '🎮', color: '#059669', desc: 'Game Boy', year: '1989', dev: 'Nintendo' },
  { id: 'nds', label: 'NDS', icon: '🖊️', color: '#d97706', desc: 'Nintendo DS', year: '2004', dev: 'Nintendo' },
  { id: 'segaMD', label: 'Genesis', icon: '💙', color: '#2563eb', desc: 'Sega Genesis', year: '1988', dev: 'Sega' },
  { id: 'psx', label: 'PSX', icon: '⚔️', color: '#7c3aed', desc: 'PlayStation', year: '1994', dev: 'Sony' },
  { id: 'atari2600', label: 'Atari', icon: '🕹️', color: '#ea580c', desc: 'Atari 2600', year: '1977', dev: 'Atari' },
  { id: 'arcade', label: 'Arcade', icon: '🎯', color: '#be123c', desc: 'Arcade Classics', year: '—', dev: 'Various' },
  { id: 'sms', label: 'SMS', icon: '🎲', color: '#0891b2', desc: 'Master System', year: '1985', dev: 'Sega' },
  { id: 'gg', label: 'GG', icon: '🟣', color: '#a21caf', desc: 'Game Gear', year: '1990', dev: 'Sega' },
];

export default function OSView() {
  const session = useEmulatorSession();
  const [view, setView] = useState<View>('home');
  const [selected, setSelected] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platform = PLATFORMS[selected];

  const scrollRow = (dir: 'left' | 'right') => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const coreMap: Record<string, string> = {
      ".nes": "nes", ".smc": "snes", ".sfc": "snes", ".gb": "gb", ".gbc": "gbc",
      ".gba": "gba", ".nds": "nds", ".md": "segaMD", ".gen": "segaMD",
      ".sms": "sms", ".gg": "gg", ".iso": "psx", ".bin": "psx",
      ".a26": "atari2600", ".zip": "arcade",
    };
    const core = coreMap[ext];
    if (!core) { alert("Unsupported format"); return; }
    const url = URL.createObjectURL(file);
    session.setGameUrl(url);
    session.setCore(core as any);
    session.setGameName(file.name);
    session.setIsPlaying(true);
    session.incrementRomKey();
    setView('emulator');
  };

  if (view === 'emulator') {
    return (
      <EmulatorView
        isPlaying={session.isPlaying}
        iframeRef={session.iframeRef}
        romKey={session.romKey}
        sendStartEmulator={session.sendStartEmulator}
        gameName={session.gameName}
        onBack={() => { session.setIsPlaying(false); setView('home'); }}
      />
    );
  }

  if (view === 'library') {
    return (
      <div className="h-full w-full bg-[#131318] relative">
        <button onClick={() => setView('home')} className="absolute top-6 left-8 z-50 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors">
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </button>
        <FileExplorerApp {...session} onStartGame={() => setView('emulator')} />
      </div>
    );
  }

  if (view === 'controller') {
    return (
      <div className="h-full w-full bg-[#131318] relative">
        <button onClick={() => setView('home')} className="absolute top-6 left-8 z-50 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors">
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </button>
        <ControllerApp {...session} />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#131318] overflow-hidden font-['Hanken_Grotesk',sans-serif] relative">
      <input ref={fileInputRef} type="file" onChange={handleFile} className="hidden" accept=".nes,.smc,.sfc,.gb,.gbc,.gba,.nds,.md,.gen,.sms,.gg,.iso,.bin,.a26,.zip" />

      {/* Level 0: Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 opacity-40"
          style={{
            background: `radial-gradient(ellipse at 30% 40%, ${platform.color}25 0%, transparent 70%), radial-gradient(ellipse at 70% 60%, ${platform.color}10 0%, transparent 50%)`,
            backgroundColor: '#131318'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131318] via-[#131318]/80 to-transparent" />
      </div>

      {/* Top Nav */}
      <nav className="absolute top-0 w-full z-50 flex justify-between items-center px-10 pt-6 h-20 bg-gradient-to-b from-[#131318]/80 to-transparent" style={{fontFamily: "'Geist', sans-serif"}}>
        <div className="text-lg font-bold text-white/90 uppercase tracking-[0.15em] flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[#0070d1] flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-white" />
          </div>
          SUN EMU
        </div>
        <div className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <span className="text-xs font-semibold text-white border-b-2 border-[#a7c8ff] pb-1 tracking-wider uppercase">Games</span>
          <span className="text-xs font-semibold text-white/40 hover:text-white/70 transition-colors tracking-wider uppercase cursor-pointer">Media</span>
        </div>
        <div className="flex items-center gap-5 text-white/60">
          <Search className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
          <Settings className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white cursor-pointer">
            S
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="absolute inset-0 z-10 flex flex-col pt-[140px] px-10 pb-6 pointer-events-none">
        {/* Game Title / Metadata */}
        <div className="mb-6 max-w-2xl animate-[fadeIn_0.5s_ease-out] pointer-events-auto">
          <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-2xl leading-[1.1] tracking-tight" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
            {platform.label}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-[10px] font-semibold tracking-wider border border-white/5 text-white/70" style={{fontFamily: "'Geist', sans-serif"}}>
              {platform.year}
            </span>
            <span className="text-xs font-medium text-white/40" style={{fontFamily: "'Geist', sans-serif"}}>
              {platform.dev}
            </span>
          </div>
        </div>

        {/* Game Ribbon */}
        <div className="relative mt-auto mb-6 pointer-events-auto">
          <div className="flex items-center gap-1 mb-3 px-1">
            <span className="text-[10px] font-semibold text-white/20 tracking-[0.15em] uppercase" style={{fontFamily: "'Geist', sans-serif"}}>Platforms</span>
            <div className="flex-1 h-px bg-white/5 ml-3" />
          </div>
          <div className="relative flex items-center">
            <button onClick={() => scrollRow('left')} className="absolute -left-3 z-30 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/5 flex items-center justify-center hover:bg-black/60 transition-colors">
              <ChevronLeft className="w-4 h-4 text-white/50" />
            </button>
            <div ref={rowRef} className="flex items-center gap-3 overflow-x-auto px-2 py-1 scroll-smooth" style={{scrollbarWidth: 'none'}}>
              {PLATFORMS.map((p, i) => {
                const isActive = i === selected;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelected(i);
                      const tile = rowRef.current?.children[i] as HTMLElement;
                      tile?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }}
                    className="flex-shrink-0 rounded-xl overflow-hidden relative transition-all duration-300"
                    style={{
                      width: isActive ? '180px' : '140px',
                      height: isActive ? '180px' : '140px',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: isActive ? `0 0 30px ${p.color}40, 0 0 0 2px ${p.color}80` : 'none',
                      zIndex: isActive ? 20 : 1,
                      margin: isActive ? '0 16px' : '0',
                    }}
                  >
                    <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${p.color}30, ${p.color}08)` }} />
                    <div className="absolute inset-0 border border-white/5 rounded-xl" style={{ borderColor: isActive ? p.color + '80' : undefined }} />
                    <div className={`absolute inset-0 bg-black/40 ${isActive ? 'opacity-0' : 'opacity-40 group-hover:opacity-10'} transition-opacity`} />
                    <div className="absolute top-3 left-3 text-3xl">{p.icon}</div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-[9px] font-bold text-white/40 tracking-wider uppercase">{p.year}</div>
                      <div className="text-xs font-bold text-white/90 truncate">{p.label}</div>
                    </div>
                  </button>
                );
              })}
              <button
                onClick={() => setView('library')}
                className="flex-shrink-0 w-[140px] h-[140px] rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 opacity-70 hover:opacity-100"
              >
                <FolderOpen className="w-7 h-7 text-white/30" />
                <span className="text-[10px] font-semibold text-white/30">Game Library</span>
              </button>
            </div>
            <button onClick={() => scrollRow('right')} className="absolute -right-3 z-30 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/5 flex items-center justify-center hover:bg-black/60 transition-colors">
              <ChevronRight className="w-4 h-4 text-white/50" />
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="flex gap-4 pointer-events-auto w-full max-w-[900px]">
          {/* Play Card */}
          <button
            onClick={openFilePicker}
            className="rounded-xl p-5 flex flex-col justify-between w-[240px] h-[130px] group relative overflow-hidden transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${platform.color}20, transparent)`,
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div>
              <h3 className="text-xl font-bold text-white leading-none" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>Play</h3>
              <p className="text-[11px] font-medium text-white/30 mt-1.5">Load a ROM file</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-black ml-0.5" fill="currentColor" />
              </div>
              <span className="text-[11px] font-semibold text-white/50">Start</span>
            </div>
          </button>

          {/* Platform Info Card */}
          <div
            className="rounded-xl p-5 flex flex-col justify-between flex-1 max-w-[320px] h-[130px]"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-white/40" />
                <div>
                  <h4 className="text-sm font-semibold text-white leading-tight">{platform.label}</h4>
                  <p className="text-[10px] font-medium text-white/30">{platform.desc}</p>
                </div>
              </div>
              <span className="text-lg font-bold text-white/40">{platform.year}</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-auto">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((selected + 1) / PLATFORMS.length) * 100}%`, background: `linear-gradient(90deg, ${platform.color}, ${platform.color}80)` }} />
            </div>
          </div>

          {/* Controller Card */}
          <button
            onClick={() => setView('controller')}
            className="rounded-xl p-5 flex flex-col justify-between flex-1 max-w-[240px] h-[130px] group"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/5">
                <Gamepad2 className="w-5 h-5 text-white/40" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">Controller</p>
                <h4 className="text-sm font-semibold text-white leading-tight mt-0.5">Pair Device</h4>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/20 group-hover:text-white/40 transition-colors">
              <Smartphone className="w-4 h-4" />
              <span className="text-[10px] font-medium">Connect</span>
            </div>
          </button>
        </div>
      </main>

      {/* Bottom Hints */}
      <div className="absolute bottom-6 right-10 z-50 flex items-center gap-5 pointer-events-none opacity-60" style={{fontFamily: "'Geist', sans-serif"}}>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
            <ArrowUp className="w-3 h-3 text-white/50" />
          </div>
          <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
            <ArrowDown className="w-3 h-3 text-white/50" />
          </div>
          <span className="text-[10px] font-medium text-white/40 ml-1">Navigate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
            <Play className="w-3 h-3 text-black ml-0.5" fill="currentColor" />
          </div>
          <span className="text-[10px] font-medium text-white/40">Select</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
