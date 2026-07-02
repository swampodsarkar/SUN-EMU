import React, { useRef } from 'react';
import { Upload, Gamepad2, Plus, FolderOpen } from 'lucide-react';
import { motion } from 'motion/react';
import type { SupportedCore } from '../types';

const coreExtensions: Record<string, SupportedCore> = {
  ".nes": "nes",
  ".smc": "snes",
  ".sfc": "snes",
  ".gb": "gb",
  ".gbc": "gbc",
  ".gba": "gba",
  ".nds": "nds",
  ".md": "segaMD",
  ".gen": "segaMD",
  ".sms": "sms",
  ".gg": "gg",
  ".iso": "psx",
  ".bin": "psx",
  ".a26": "atari2600",
  ".zip": "arcade",
};

const coreColors: Record<string, string> = {
  nes: "#e11d48",
  snes: "#7c3aed",
  gb: "#059669",
  gbc: "#059669",
  gba: "#0284c7",
  nds: "#d97706",
  segaMD: "#0284c7",
  sms: "#0284c7",
  gg: "#0284c7",
  psx: "#7c3aed",
  atari2600: "#ea580c",
  arcade: "#be123c",
};

const coreNames: Record<string, string> = {
  nes: "NES",
  snes: "SNES",
  gb: "Game Boy",
  gbc: "Game Boy Color",
  gba: "Game Boy Advance",
  nds: "Nintendo DS",
  segaMD: "Sega Genesis",
  sms: "Sega Master System",
  gg: "Sega Game Gear",
  psx: "PlayStation",
  atari2600: "Atari 2600",
  arcade: "Arcade",
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const detectedCore = coreExtensions[ext];

    if (!detectedCore) {
      alert("Unsupported file format. Supported: .nes, .smc, .gb, .gba, .iso and more.");
      return;
    }

    const url = URL.createObjectURL(file);
    setGameUrl(url);
    setCore(detectedCore);
    setGameName(file.name);
    setIsPlaying(true);
    incrementRomKey();
    onStartGame();
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-8 md:px-16 pt-6 pb-6 shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Game Library</h2>
            <p className="text-xs text-white/30 mt-1 font-medium">Select a ROM file to start playing</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#0070d1] hover:bg-[#0090ff] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,112,209,0.2)] hover:shadow-[0_0_30px_rgba(0,112,209,0.35)] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Load ROM
          </button>
        </div>

        {/* Supported Formats */}
        <div className="flex gap-2 flex-wrap">
          {['NES', 'SNES', 'GBA', 'PSX', 'Genesis', 'NDS', 'Arcade'].map((fmt) => (
            <span key={fmt} className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-white/30 tracking-wider uppercase border border-white/5">
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {/* Game Grid / Upload Area */}
      <div className="flex-1 px-8 md:px-16 pb-6 overflow-y-auto min-h-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* Upload Card */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => fileInputRef.current?.click()}
            className="group aspect-[3/4] rounded-2xl border-2 border-dashed border-white/10 hover:border-[#0070d1]/40 bg-[#1a1a2e]/30 hover:bg-[#1a1a2e]/60 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#0070d1]/10 group-hover:bg-[#0070d1]/20 flex items-center justify-center transition-colors">
              <Upload className="w-6 h-6 text-[#0070d1]/60 group-hover:text-[#0070d1]" />
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-white/50 group-hover:text-white/80 transition-colors">Load ROM</div>
              <div className="text-[10px] text-white/20 mt-0.5">Click to browse</div>
            </div>
          </motion.button>

          {/* Placeholder Game Cards */}
          {[
            { name: "Select a ROM", desc: "NES", color: "#e11d48", icon: "🍄" },
            { name: "to start", desc: "GBA", color: "#0284c7", icon: "⚡" },
            { name: "playing", desc: "SNES", color: "#7c3aed", icon: "🗡️" },
            { name: "retro", desc: "PSX", color: "#d97706", icon: "⚔️" },
            { name: "games", desc: "Genesis", color: "#059669", icon: "💙" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="aspect-[3/4] rounded-2xl overflow-hidden relative group"
              style={{ background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)` }}
            >
              <div className="absolute inset-0 border border-white/5 rounded-2xl" />
              <div className="absolute top-4 left-4 text-2xl opacity-40">{item.icon}</div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="text-[9px] font-bold text-white/30 tracking-wider uppercase">{item.desc}</div>
                <div className="text-xs font-semibold text-white/50">{item.name}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept=".nes,.smc,.sfc,.gb,.gbc,.gba,.nds,.md,.gen,.sms,.gg,.iso,.bin,.a26,.zip"
      />
    </div>
  );
}
