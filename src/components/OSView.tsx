import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, FolderOpen, Smartphone, Play, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import EmulatorView from './EmulatorView';
import FileExplorerApp from './FileExplorerApp';
import ControllerApp from './ControllerApp';
import { useEmulatorSession } from '../lib/useEmulatorSession';
import { motion, AnimatePresence } from 'motion/react';

type View = 'home' | 'library' | 'controller' | 'emulator';

const PLATFORMS = [
  { id: 'nes', label: 'NES', icon: '🍄', color: '#e11d48', desc: 'Nintendo Entertainment System', year: '1983' },
  { id: 'snes', label: 'SNES', icon: '🗡️', color: '#7c3aed', desc: 'Super Nintendo', year: '1990' },
  { id: 'gba', label: 'GBA', icon: '⚡', color: '#0284c7', desc: 'Game Boy Advance', year: '2001' },
  { id: 'gb', label: 'GB', icon: '🎮', color: '#059669', desc: 'Game Boy', year: '1989' },
  { id: 'nds', label: 'NDS', icon: '🖊️', color: '#d97706', desc: 'Nintendo DS', year: '2004' },
  { id: 'segaMD', label: 'Genesis', icon: '💙', color: '#2563eb', desc: 'Sega Genesis', year: '1988' },
  { id: 'psx', label: 'PSX', icon: '⚔️', color: '#7c3aed', desc: 'PlayStation', year: '1994' },
  { id: 'atari2600', label: 'Atari', icon: '🕹️', color: '#ea580c', desc: 'Atari 2600', year: '1977' },
  { id: 'arcade', label: 'Arcade', icon: '🎯', color: '#be123c', desc: 'Arcade Classics', year: '—' },
  { id: 'sms', label: 'SMS', icon: '🎲', color: '#0891b2', desc: 'Master System', year: '1985' },
  { id: 'gg', label: 'GG', icon: '🟣', color: '#a21caf', desc: 'Game Gear', year: '1990' },
];

export default function OSView() {
  const session = useEmulatorSession();
  const [view, setView] = useState<View>('home');
  const [selectedPlatform, setSelectedPlatform] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platform = PLATFORMS[selectedPlatform];

  const scrollRow = (dir: 'left' | 'right') => {
    if (rowRef.current) {
      const amt = 300;
      rowRef.current.scrollBy({ left: dir === 'left' ? -amt : amt, behavior: 'smooth' });
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

  useEffect(() => {
    if (view === 'home') {
      document.title = 'Sun Emulator';
    }
  }, [view]);

  const goHome = () => {
    if (view === 'emulator' && session.isPlaying) {
      session.setIsPlaying(false);
    }
    setView('home');
  };

  if (view === 'emulator') {
    return (
      <EmulatorView
        isPlaying={session.isPlaying}
        iframeRef={session.iframeRef}
        romKey={session.romKey}
        sendStartEmulator={session.sendStartEmulator}
        gameName={session.gameName}
        onBack={goHome}
      />
    );
  }

  if (view === 'library') {
    return (
      <div className="h-full w-full relative">
        <button onClick={goHome} className="absolute top-6 left-8 z-50 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors">
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </button>
        <FileExplorerApp
          {...session}
          onStartGame={() => setView('emulator')}
        />
      </div>
    );
  }

  if (view === 'controller') {
    return (
      <div className="h-full w-full relative">
        <button onClick={goHome} className="absolute top-6 left-8 z-50 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors">
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </button>
        <ControllerApp {...session} />
      </div>
    );
  }

  // === PS5 HOME SCREEN ===
  return (
    <div className="h-full w-full bg-[#050510] flex flex-col overflow-hidden font-sans relative">
      <input ref={fileInputRef} type="file" onChange={handleFile} className="hidden" accept=".nes,.smc,.sfc,.gb,.gbc,.gba,.nds,.md,.gen,.sms,.gg,.iso,.bin,.a26,.zip" />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-[15%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,114,206,0.06)_0%,transparent_70%)]" />
      </div>

      {/* ===== TOP BAR ===== */}
      <header className="relative z-40 flex items-center justify-end px-8 py-5 shrink-0">
        <div className="flex items-center gap-4 text-white/30 text-xs font-medium">
          <button onClick={() => setView('controller')} className="hover:text-white/60 transition-colors">
            <Smartphone className="w-4 h-4" />
          </button>
          <span className="font-semibold tracking-wider">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/8">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
          </div>
        </div>
      </header>

      {/* ===== HERO AREA ===== */}
      <div className="flex-1 relative z-10 flex items-center min-h-0 px-8 md:px-16 pb-4">
        <div className="flex items-center gap-12 w-full max-w-6xl mx-auto">
          {/* Game Art */}
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0 w-[280px] md:w-[340px] aspect-[3/4] rounded-3xl overflow-hidden relative"
          >
            <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${platform.color}30, ${platform.color}08)` }} />
            <div className="absolute inset-0 border border-white/5 rounded-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl md:text-9xl opacity-30">{platform.icon}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <div className="text-[10px] font-bold text-white/40 tracking-wider uppercase">{platform.year}</div>
              <div className="text-lg font-bold text-white mt-1">{platform.label}</div>
            </div>
          </motion.div>

          {/* Game Info */}
          <motion.div
            key={`info-${platform.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-0"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0072ce]" />
              <span className="text-[10px] font-bold text-[#0072ce] tracking-[0.25em] uppercase">Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight leading-[1.05]">
              {platform.label}
            </h1>
            <div className="text-white/30 text-sm font-medium mb-2">{platform.icon} {platform.desc}</div>
            <div className="w-12 h-0.5 bg-white/10 my-4" />
            <p className="text-white/30 text-sm max-w-md leading-relaxed mb-8">
              Load a ROM file for this platform and start playing instantly. Your progress saves automatically in your browser.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={openFilePicker}
                className="ps5-btn-primary flex items-center gap-2.5 text-white font-semibold text-sm px-7 py-3.5 rounded-2xl"
              >
                <Play className="w-4 h-4" fill="currentColor" />
                Load & Play
              </button>
              <button
                onClick={() => setView('library')}
                className="ps5-btn flex items-center gap-2 text-white/60 text-sm px-6 py-3.5 rounded-2xl"
              >
                <FolderOpen className="w-4 h-4" />
                Game Library
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== GAME TILES ROW (PS5 style) ===== */}
      <div className="relative z-20 shrink-0 pb-5">
        {/* Section label */}
        <div className="px-8 md:px-16 mb-3">
          <span className="text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase">Platforms</span>
        </div>

        <div className="relative">
          {/* Scroll Left */}
          <button onClick={() => scrollRow('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/8 flex items-center justify-center hover:bg-black/60 transition-colors">
            <ChevronLeft className="w-4 h-4 text-white/60" />
          </button>

          {/* Tiles */}
          <div
            ref={rowRef}
            className="flex gap-3 overflow-x-auto px-8 md:px-16 pb-2 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {PLATFORMS.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.03 }}
                onClick={() => {
                  setSelectedPlatform(i);
                  // Scroll the tile into view
                  if (rowRef.current) {
                    const tile = rowRef.current.children[i] as HTMLElement;
                    if (tile) tile.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  }
                }}
                className={`ps5-tile w-[130px] md:w-[150px] aspect-[4/5] rounded-2xl overflow-hidden relative ${selectedPlatform === i ? 'active' : ''}`}
                style={{ background: `linear-gradient(145deg, ${p.color}18, ${p.color}06)` }}
              >
                <div className="absolute inset-0 border border-white/5 rounded-2xl" />
                {selectedPlatform === i && (
                  <div className="absolute inset-0 border-2 border-white/60 rounded-2xl" />
                )}
                <div className="absolute top-3 left-3 text-2xl md:text-3xl">{p.icon}</div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <div className="text-[10px] font-bold text-white/40 tracking-wider uppercase">{p.year}</div>
                  <div className="text-xs md:text-sm font-bold text-white/90 truncate">{p.label}</div>
                </div>
                {selectedPlatform === i && (
                  <div className="absolute inset-0 bg-[#0072ce]/5" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Scroll Right */}
          <button onClick={() => scrollRow('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/8 flex items-center justify-center hover:bg-black/60 transition-colors">
            <ChevronRight className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
}
