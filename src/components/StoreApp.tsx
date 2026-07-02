import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Download, Play, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StoreApp({ onPlayGame }: { onPlayGame: (name: string, url: string, core: string) => void }) {
  const store = useStore();
  const [downloading, setDownloading] = useState<Record<string, number>>({});

  const handleDownload = (game: any) => {
    if (downloading[game.id]) return;
    
    setDownloading(prev => ({ ...prev, [game.id]: 0 }));
    
    // Simulate download
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setDownloading(prev => ({ ...prev, [game.id]: progress }));
    }, 500);
  };

  const getCoreFromLink = (link: string) => {
    const ext = link.split('.').pop()?.toLowerCase();
    const coreMap: Record<string, string> = {
      "nes": "nes", "smc": "snes", "sfc": "snes", "n64": "n64", "v64": "n64", "z64": "n64",
      "gb": "gb", "gbc": "gbc", "gba": "gba", "nds": "nds", 
      "md": "segaMD", "gen": "segaMD", "sms": "sms", "gg": "gg", 
      "iso": "psx", "bin": "psx", "zip": "arcade"
    };
    return ext ? coreMap[ext] || 'nes' : 'nes';
  };

  return (
    <div className="h-full w-full bg-[#0a0a0a] text-white p-12 overflow-y-auto">
      <h1 className="text-5xl font-bold mb-2">Store</h1>
      <p className="text-xl text-white/50 mb-12">Discover and download new retro games</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {store.games.map(game => {
          const dlProgress = downloading[game.id];
          const isDownloaded = dlProgress === 100;
          
          return (
            <motion.div 
              key={game.id} 
              className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all hover:scale-105 group"
              whileHover={{ y: -10 }}
            >
              <div className="aspect-[4/3] bg-black relative">
                {game.coverImage ? (
                  <img src={game.coverImage} alt={game.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                {game.core && (
                   <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase border border-white/10 shadow-lg text-white">
                     {game.core}
                   </div>
                )}
              </div>
              
              <div className="p-6 relative">
                <h3 className="text-2xl font-bold mb-1 truncate">{game.name}</h3>
                <p className="text-white/50 text-sm mb-6">{game.size}</p>
                
                {dlProgress !== undefined && dlProgress < 100 ? (
                  <div className="w-full bg-white/10 rounded-full h-12 flex items-center px-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 bg-blue-500/50 transition-all duration-200" style={{ width: `${dlProgress}%` }} />
                    <span className="relative z-10 text-sm font-bold">Downloading... {Math.round(dlProgress)}%</span>
                  </div>
                ) : isDownloaded ? (
                  <button 
                    onClick={() => {
                      store.playGame(game.id);
                      onPlayGame(game.name, game.rawLink, game.core || getCoreFromLink(game.rawLink));
                    }}
                    className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]"
                  >
                    <Play className="w-5 h-5 fill-current" /> Play Game
                  </button>
                ) : (
                  <button 
                    onClick={() => handleDownload(game)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-5 h-5" /> Download
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
