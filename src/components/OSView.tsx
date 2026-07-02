import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, FolderOpen, Smartphone, Play, Search, Settings, ChevronLeft, ChevronRight, Star, ArrowUp, ArrowDown, Upload } from 'lucide-react';
import EmulatorView from './EmulatorView';
import FileExplorerApp from './FileExplorerApp';
import ControllerApp from './ControllerApp';
import { useEmulatorSession } from '../lib/useEmulatorSession';

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
      rowRef.current.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
    }
  };

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
    <div className="h-full w-full bg-[#131318] overflow-hidden relative" style={{fontFamily: "'Hanken Grotesk', sans-serif"}}>
      <input ref={fileInputRef} type="file" onChange={handleFile} className="hidden" accept=".nes,.smc,.sfc,.gb,.gbc,.gba,.nds,.md,.gen,.sms,.gg,.iso,.bin,.a26,.zip" />

      {/* Background layer */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 transition-colors duration-700" style={{ background: `radial-gradient(ellipse at 30% 30%, ${platform.color}20 0%, transparent 60%), #131318` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131318] via-[#131318]/60 to-transparent" />
      </div>

      {/* Top Nav */}
      <nav className="relative z-50 flex items-center justify-between px-8 pt-5 pb-3" style={{fontFamily: "'Geist', sans-serif"}}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[#0070d1] flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white/80 uppercase tracking-[0.15em]">SUN EMU</span>
        </div>
        <div className="flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <span className="text-[11px] font-semibold text-white border-b-2 border-[#a7c8ff] pb-1 tracking-[0.15em] uppercase cursor-pointer">Games</span>
          <span className="text-[11px] font-semibold text-white/30 hover:text-white/60 tracking-[0.15em] uppercase cursor-pointer transition-colors">Media</span>
        </div>
        <div className="flex items-center gap-4 text-white/40">
          <Search className="w-[18px] h-[18px] hover:text-white/70 cursor-pointer transition-colors" />
          <Settings className="w-[18px] h-[18px] hover:text-white/70 cursor-pointer transition-colors" />
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white cursor-pointer">
            S
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-[calc(100%-52px)] px-8 pb-4">
        {/* Hero title */}
        <div className="pt-6 pb-4 animate-[fadeIn_0.4s_ease-out]">
          <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight drop-shadow-2xl" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
            {platform.label}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <span className="px-2.5 py-0.5 bg-white/8 rounded-full text-[10px] font-semibold tracking-wider text-white/60 border border-white/5" style={{fontFamily: "'Geist', sans-serif"}}>
              {platform.year}
            </span>
            <span className="text-xs text-white/30 font-medium" style={{fontFamily: "'Geist', sans-serif"}}>{platform.dev}</span>
          </div>
        </div>

        {/* Spacer to push rest down */}
        <div className="flex-1 min-h-0" />

        {/* Game ribbon */}
        <div className="pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold text-white/20 tracking-[0.15em] uppercase" style={{fontFamily: "'Geist', sans-serif"}}>Platforms</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="relative">
            <button onClick={() => scrollRow('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur border border-white/5 flex items-center justify-center hover:bg-black/70 transition-colors">
              <ChevronLeft className="w-4 h-4 text-white/50" />
            </button>
            <div ref={rowRef} className="flex items-end gap-3 overflow-x-auto px-4 py-1" style={{scrollbarWidth: 'none'}}>
              {PLATFORMS.map((p, i) => {
                const active = i === selected;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelected(i);
                      rowRef.current?.children[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }}
                    className="flex-shrink-0 rounded-xl overflow-hidden relative transition-all duration-300 ease-out"
                    style={{
                      width: active ? 176 : 136,
                      height: active ? 176 : 136,
                      zIndex: active ? 10 : 1,
                    }}
                  >
                    <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${p.color}30, ${p.color}08)` }} />
                    <div className="absolute inset-0 rounded-xl border" style={{ borderColor: active ? p.color + '99' : 'rgba(255,255,255,0.05)' }} />
                    {active && (
                      <div className="absolute inset-0 rounded-xl" style={{ boxShadow: `0 0 35px ${p.color}50` }} />
                    )}
                    <div className="absolute inset-0 bg-black/30" />
                    <span className="absolute top-3 left-3 text-2xl">{p.icon}</span>
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="text-[8px] font-bold text-white/40 tracking-wider uppercase">{p.year}</div>
                      <div className="text-[11px] font-bold text-white/90 truncate">{p.label}</div>
                    </div>
                  </button>
                );
              })}
              <button
                onClick={() => setView('library')}
                className="flex-shrink-0 w-[136px] h-[136px] rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 opacity-60 hover:opacity-100"
              >
                <FolderOpen className="w-7 h-7 text-white/25" />
                <span className="text-[10px] font-semibold text-white/25">Library</span>
              </button>
            </div>
            <button onClick={() => scrollRow('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur border border-white/5 flex items-center justify-center hover:bg-black/70 transition-colors">
              <ChevronRight className="w-4 h-4 text-white/50" />
            </button>
          </div>
        </div>

        {/* Info cards */}
        <div className="flex gap-3">
          <button onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 rounded-xl px-5 py-3 group transition-all duration-200 hover:bg-white/[0.06]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Play</div>
              <div className="text-[10px] text-white/30">Load a ROM</div>
            </div>
          </button>

          <div className="flex-1 rounded-xl px-5 py-3 max-w-[300px]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-white/30" />
                <span className="text-xs font-semibold text-white/60">{platform.desc}</span>
              </div>
              <span className="text-xs font-bold text-white/40">{platform.year}</span>
            </div>
          </div>

          <button onClick={() => setView('controller')}
            className="flex items-center gap-3 rounded-xl px-5 py-3 group transition-all duration-200 hover:bg-white/[0.06]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
              <Gamepad2 className="w-4 h-4 text-white/40" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Controller</div>
              <div className="text-[10px] text-white/30">Pair Device</div>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom hints */}
      <div className="absolute bottom-4 right-8 z-50 flex items-center gap-4 opacity-40" style={{fontFamily: "'Geist', sans-serif"}}>
        <div className="flex items-center gap-1.5">
          <div className="w-[18px] h-[18px] rounded-full border border-white/30 flex items-center justify-center"><ArrowUp className="w-2.5 h-2.5 text-white/50" /></div>
          <div className="w-[18px] h-[18px] rounded-full border border-white/30 flex items-center justify-center"><ArrowDown className="w-2.5 h-2.5 text-white/50" /></div>
          <span className="text-[9px] font-medium text-white/30 ml-1">Navigate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-[18px] h-[18px] rounded-full bg-white/80 flex items-center justify-center"><Play className="w-2.5 h-2.5 text-black ml-0.5" fill="currentColor" /></div>
          <span className="text-[9px] font-medium text-white/30">Select</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
