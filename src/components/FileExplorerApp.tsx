import React from 'react';
import { Upload, MonitorPlay, Zap } from 'lucide-react';
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

export default function FileExplorerApp({ 
  setGameUrl, 
  setCore, 
  setGameName, 
  setIsPlaying,
  openEmulatorWindow
}: any) {

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const detectedCore = coreExtensions[ext];

    if (!detectedCore) {
      alert("Unsupported file format or core not detected automatically. You may need to select manually.");
      return;
    }

    const url = URL.createObjectURL(file);
    setGameUrl(url);
    setCore(detectedCore);
    setGameName(file.name);
    
    // Automatically start
    setIsPlaying(true);
    openEmulatorWindow();
  };

  return (
    <div className="h-full w-full bg-[#020617] text-white p-8 overflow-auto font-sans">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20">
          <Upload className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-4">File Explorer</h2>
        <p className="text-slate-400 mb-8 leading-relaxed max-w-md">
          Select a ROM file from your device to begin playing in Sun Emulator. Supported formats: .nes, .smc, .gb, .gba, .iso and more.
        </p>
        
        <div className="relative overflow-hidden w-full max-w-xs">
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <MonitorPlay className="w-5 h-5" />
            Select ROM File
          </button>
          <input
            type="file"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".nes,.smc,.sfc,.gb,.gbc,.gba,.nds,.md,.gen,.sms,.gg,.iso,.bin,.a26,.zip"
          />
        </div>
      </div>
    </div>
  );
}
