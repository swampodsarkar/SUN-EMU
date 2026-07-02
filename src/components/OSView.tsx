import React, { useState } from 'react';
import { X, Minus, Square, Gamepad2, PlaySquare, Calculator, FileText, Monitor, LayoutGrid, Search, Volume2, Wifi } from 'lucide-react';
import EmulatorView from './EmulatorView';
import { motion, AnimatePresence } from 'motion/react';

function AdApp() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-slate-900 text-white font-sans">
      <div className="w-24 h-24 bg-amber-500/20 rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] border border-amber-500/30">
        <PlaySquare className="w-12 h-12 text-amber-500" />
      </div>
      <h2 className="text-3xl font-display font-bold mb-4">Earn Rewards</h2>
      <p className="text-slate-400 mb-10 max-w-md text-center text-lg leading-relaxed">Watch a short advertisement to earn Sun Coins to unlock premium themes and cloud game saves.</p>
      <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-amber-950 font-bold px-10 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] active:scale-95 text-lg">
        Watch Ad Now
      </button>
    </div>
  );
}

function PlaceholderApp({ name }: { name: string }) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-[#020617] text-slate-400 font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center shadow-inner">
          <Monitor className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-2xl font-medium text-slate-300">{name}</h2>
        <p className="text-sm text-slate-500">System App Placeholder</p>
      </div>
    </div>
  );
}

export default function OSView() {
  const [windows, setWindows] = useState([
    { id: 'emulator', title: 'Sun Emulator', icon: Gamepad2, isOpen: true, isMinimized: false, zIndex: 10, Component: <EmulatorView isWindowed={true} /> },
    { id: 'ads', title: 'Watch Ad to Earn', icon: PlaySquare, isOpen: false, isMinimized: false, zIndex: 1, Component: <AdApp /> },
    { id: 'calc', title: 'Calculator', icon: Calculator, isOpen: false, isMinimized: false, zIndex: 2, Component: <PlaceholderApp name="Calculator" /> },
    { id: 'notepad', title: 'Notepad', icon: FileText, isOpen: false, isMinimized: false, zIndex: 3, Component: <PlaceholderApp name="Notepad" /> },
  ]);

  const [activeWindow, setActiveWindow] = useState('emulator');

  const openWindow = (id: string) => {
    setWindows(ws => ws.map(w => {
      if (w.id === id) {
        return { ...w, isOpen: true, isMinimized: false, zIndex: Math.max(0, ...ws.map(x => x.zIndex)) + 1 };
      }
      return w;
    }));
    setActiveWindow(id);
  };

  const closeWindow = (id: string) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };
  
  const minimizeWindow = (id: string) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const focusWindow = (id: string) => {
    setWindows(ws => ws.map(w => {
      if (w.id === id) {
        return { ...w, isMinimized: false, zIndex: Math.max(0, ...ws.map(x => x.zIndex)) + 1 };
      }
      return w;
    }));
    setActiveWindow(id);
  };

  return (
    <div className="h-screen w-full bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center overflow-hidden flex flex-col font-sans relative">
      <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
      
      {/* Desktop Area */}
      <div className="flex-1 relative p-6 z-10">
        {/* Desktop Icons */}
        <div className="flex flex-col gap-6 w-24">
          {windows.map(w => (
            <button 
              key={`icon-${w.id}`}
              onClick={() => openWindow(w.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 group text-white transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg group-hover:bg-white/10 transition-transform group-active:scale-95">
                <w.icon className="w-6 h-6 drop-shadow-lg text-indigo-100 group-hover:text-white" />
              </div>
              <span className="text-xs text-center drop-shadow-md font-medium text-white/90 line-clamp-2">{w.title}</span>
            </button>
          ))}
        </div>

        {/* Render Windows */}
        <AnimatePresence>
          {windows.filter(w => w.isOpen && !w.isMinimized).map(w => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.15 }}
              key={w.id}
              onMouseDown={() => focusWindow(w.id)}
              style={{ zIndex: w.zIndex }}
              className={`absolute top-4 left-4 right-4 bottom-16 sm:top-10 sm:left-32 sm:right-32 sm:bottom-10 bg-[#020617]/95 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${activeWindow === w.id ? 'ring-1 ring-white/30 shadow-[0_0_80px_rgba(0,0,0,0.6)]' : 'opacity-90 grayscale-[0.2]'}`}
            >
              {/* Window Title Bar */}
              <div className="h-12 bg-white/5 flex items-center justify-between px-4 border-b border-white/10 select-none">
                <div className="flex items-center gap-3 text-slate-200">
                  <w.icon className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold tracking-wide">{w.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); minimizeWindow(w.id); }} className="w-10 h-8 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white rounded transition-colors"><Minus className="w-4 h-4" /></button>
                  <button className="w-10 h-8 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white rounded transition-colors"><Square className="w-3 h-3" /></button>
                  <button onClick={(e) => { e.stopPropagation(); closeWindow(w.id); }} className="w-10 h-8 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white rounded transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </div>
              {/* Window Content */}
              <div className="flex-1 overflow-auto relative bg-[#020617]">
                {w.Component}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Taskbar */}
      <div className="h-14 bg-slate-900/80 backdrop-blur-3xl border-t border-white/10 flex items-center justify-between px-4 z-50">
        <div className="flex items-center justify-center gap-2 flex-1">
          <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors group">
            <LayoutGrid className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1"></div>
          {windows.map(w => w.isOpen && (
            <button 
              key={`taskbar-${w.id}`}
              onClick={() => {
                if (activeWindow === w.id && !w.isMinimized) {
                  minimizeWindow(w.id);
                } else {
                  focusWindow(w.id);
                }
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${activeWindow === w.id && !w.isMinimized ? 'bg-white/20 shadow-inner relative' : 'hover:bg-white/10 relative'}`}
            >
              <w.icon className={`w-5 h-5 ${activeWindow === w.id && !w.isMinimized ? 'text-white' : 'text-slate-400'}`} />
              <div className={`absolute -bottom-[2px] h-[3px] rounded-full transition-all ${activeWindow === w.id && !w.isMinimized ? 'w-4 bg-indigo-400' : 'w-1 bg-slate-500'}`}></div>
            </button>
          ))}
        </div>
        
        {/* System Tray */}
        <div className="flex items-center gap-3 pr-2 text-slate-300">
          <div className="flex items-center hover:bg-white/10 px-2 py-1 rounded transition-colors cursor-pointer gap-3">
            <Wifi className="w-4 h-4" />
            <Volume2 className="w-4 h-4" />
          </div>
          <div className="text-xs font-medium text-right flex flex-col hover:bg-white/10 px-2 py-1 rounded transition-colors cursor-pointer">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
