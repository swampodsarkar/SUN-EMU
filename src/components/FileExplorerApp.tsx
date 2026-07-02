import React, { useRef, useState } from 'react';
import { Upload, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import type { SupportedCore } from '../types';

const coreExtensions: Record<string, SupportedCore> = {
  ".nes": "nes", ".smc": "snes", ".sfc": "snes", ".gb": "gb",
  ".gbc": "gbc", ".gba": "gba", ".nds": "nds", ".md": "segaMD",
  ".gen": "segaMD", ".sms": "sms", ".gg": "gg", ".iso": "psx",
  ".bin": "psx", ".a26": "atari2600", ".zip": "arcade",
};

const PLATFORM_INFO: Record<string, { label: string, color: string, icon: string }> = {
  nes: { label: 'NES', color: '#e11d48', icon: '🍄' },
  snes: { label: 'SNES', color: '#7c3aed', icon: '🗡️' },
  gb: { label: 'Game Boy', color: '#059669', icon: '🎮' },
  gbc: { label: 'GBC', color: '#059669', icon: '🎮' },
  gba: { label: 'GBA', color: '#0284c7', icon: '⚡' },
  nds: { label: 'NDS', color: '#d97706', icon: '🖊️' },
  segaMD: { label: 'Genesis', color: '#2563eb', icon: '💙' },
  sms: { label: 'SMS', color: '#0891b2', icon: '🎲' },
  gg: { label: 'GG', color: '#a21caf', icon: '🟣' },
  psx: { label: 'PSX', color: '#7c3aed', icon: '⚔️' },
  atari2600: { label: 'Atari', color: '#ea580c', icon: '🕹️' },
  arcade: { label: 'Arcade', color: '#be123c', icon: '🎯' },
  dos: { label: 'DOS', color: '#65a30d', icon: '💻' },
};

export default function FileExplorerApp({
  setGameUrl,
  setCore,
  setGameName,
  setIsPlaying,
  incrementRomKey,
  onStartGame,
}: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [filterCore, setFilterCore] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const core = coreExtensions[ext];
    if (!core) { alert("Unsupported format"); return; }
    const url = URL.createObjectURL(file);
    setGameUrl(url);
    setCore(core);
    setGameName(file.name);
    setIsPlaying(true);
    incrementRomKey();
    onStartGame();
  };

  const platforms = Object.entries(PLATFORM_INFO)
    .filter(([id]) => !filterCore || id === filterCore)
    .filter(([_, info]) => info.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full w-full bg-[#050510] flex flex-col overflow-hidden">
      <input ref={fileInputRef} type="file" onChange={handleFile} className="hidden"
        accept=".nes,.smc,.sfc,.gb,.gbc,.gba,.nds,.md,.gen,.sms,.gg,.iso,.bin,.a26,.zip" />

      {/* Header */}
      <div className="shrink-0 px-8 md:px-16 pt-6 pb-4">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Collection</h1>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="ps5-btn-primary flex items-center gap-2 text-white font-semibold text-sm px-5 py-2.5 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Load ROM
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              placeholder="Search platforms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-white/15 transition-colors"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {['all', 'nes', 'snes', 'gba', 'psx', 'segaMD', 'nds'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterCore(f === 'all' ? null : f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                  (f === 'all' && !filterCore) || filterCore === f
                    ? 'bg-[#0072ce] text-white'
                    : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/50'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 px-8 md:px-16 pb-8 overflow-y-auto min-h-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {/* Upload Tile */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[4/5] rounded-2xl border-2 border-dashed border-white/8 hover:border-[#0072ce]/30 bg-white/[0.02] hover:bg-white/[0.04] flex flex-col items-center justify-center gap-3 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0072ce]/8 flex items-center justify-center">
              <Upload className="w-5 h-5 text-[#0072ce]/50" />
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-white/40">Add ROM</div>
              <div className="text-[9px] text-white/15 mt-0.5">Click to browse</div>
            </div>
          </motion.button>

          {/* Platform Tiles */}
          {platforms.map(([id, info], i) => (
            <motion.button
              key={id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => fileInputRef.current?.click()}
              className="ps5-tile aspect-[4/5] rounded-2xl overflow-hidden relative"
              style={{ background: `linear-gradient(145deg, ${info.color}18, ${info.color}06)` }}
            >
              <div className="absolute inset-0 border border-white/5 rounded-2xl" />
              <div className="absolute top-3 left-3 text-2xl md:text-3xl">{info.icon}</div>
              <div className="absolute bottom-0 left-0 right-0 p-3.5 bg-gradient-to-t from-black/70 to-transparent">
                <div className="text-[9px] font-bold text-white/30 tracking-wider uppercase">Platform</div>
                <div className="text-xs md:text-sm font-bold text-white/90 truncate">{info.label}</div>
              </div>
              <div className="absolute top-3 right-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: info.color, boxShadow: `0 0 6px ${info.color}80` }} />
              </div>
            </motion.button>
          ))}
        </div>

        {platforms.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-white/20">
            <Search className="w-10 h-10 mb-3" />
            <p className="text-sm font-medium">No platforms found</p>
          </div>
        )}
      </div>
    </div>
  );
}
