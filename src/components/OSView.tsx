import React, { useState, useEffect } from 'react';
import { X, Minus, Square, Gamepad2, PlaySquare, Calculator, FileText, Monitor, LayoutGrid, Search, Volume2, Wifi, Folder, Smartphone, RefreshCw, Settings, Image, FolderPlus, MonitorSmartphone, ChevronRight, User, Power, LogOut } from 'lucide-react';
import EmulatorView from './EmulatorView';
import FileExplorerApp from './FileExplorerApp';
import ControllerApp from './ControllerApp';
import ProfileApp from './ProfileApp';
import { useEmulatorSession } from '../lib/useEmulatorSession';
import { useDiscordAuth } from '../lib/useDiscordAuth';
import { motion, AnimatePresence } from 'motion/react';
import { DiscordIcon, Windows11Icon } from './icons';

import { ref, set, get } from 'firebase/database';
import { db } from '../lib/firebase';

function AdApp() {
  const { user } = useDiscordAuth();
  const [isWatching, setIsWatching] = useState(false);
  const [message, setMessage] = useState('');

  const handleWatchAd = () => {
    if (!user) {
      setMessage("Please login in Cloud Profile to earn coins.");
      return;
    }

    setIsWatching(true);
    setMessage("Watching ad...");
    
    // Simulate watching an ad
    setTimeout(async () => {
      try {
        const userRef = ref(db, `users/${user.id}`);
        const snapshot = await get(userRef);
        let currentCoins = 0;
        let userData = { username: user.username, lastUpdated: Date.now() };

        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.coins !== undefined) {
            currentCoins = data.coins;
          }
          userData = { ...data, ...userData };
        }

        await set(userRef, {
          ...userData,
          coins: currentCoins + 10,
        });

        setMessage("You earned 10 Sun Coins!");
      } catch (error) {
        console.error("Failed to add coins", error);
        setMessage("Failed to save coins to cloud.");
      } finally {
        setIsWatching(false);
        setTimeout(() => setMessage(''), 3000);
      }
    }, 2000);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-slate-900 text-white font-sans relative">
      <div className="w-24 h-24 bg-amber-500/20 rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] border border-amber-500/30">
        <PlaySquare className="w-12 h-12 text-amber-500" />
      </div>
      <h2 className="text-3xl font-display font-bold mb-4">Earn Rewards</h2>
      <p className="text-slate-400 mb-10 max-w-md text-center text-lg leading-relaxed">Watch a short advertisement to earn Sun Coins to unlock premium themes and cloud game saves.</p>
      
      <button 
        onClick={handleWatchAd}
        disabled={isWatching}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-amber-950 font-bold px-10 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] active:scale-95 text-lg disabled:opacity-50 disabled:pointer-events-none"
      >
        {isWatching ? 'Playing Ad...' : 'Watch Ad Now'}
      </button>

      {message && (
        <div className="mt-6 px-4 py-2 bg-slate-800 rounded-lg text-amber-400 font-medium">
          {message}
        </div>
      )}
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
  const session = useEmulatorSession();

  const openEmulatorWindow = () => openWindow('emulator');

  const [windows, setWindows] = useState([
    { id: 'files', title: 'File Explorer', icon: Folder, isOpen: false, isMinimized: false, zIndex: 1 },
    { id: 'controllers', title: 'Devices', icon: Smartphone, isOpen: false, isMinimized: false, zIndex: 2 },
    { id: 'profile', title: 'Cloud Profile', icon: DiscordIcon, isOpen: false, isMinimized: false, zIndex: 3 },
    { id: 'emulator', title: 'Sun Emulator', icon: Gamepad2, isOpen: false, isMinimized: false, zIndex: 4 },
    { id: 'ads', title: 'Watch Ad to Earn', icon: PlaySquare, isOpen: false, isMinimized: false, zIndex: 5 },
    { id: 'calc', title: 'Calculator', icon: Calculator, isOpen: false, isMinimized: false, zIndex: 6 },
    { id: 'notepad', title: 'Notepad', icon: FileText, isOpen: false, isMinimized: false, zIndex: 7 },
  ]);

  const renderWindowContent = (id: string) => {
    switch (id) {
      case 'files':
        return <FileExplorerApp {...session} openEmulatorWindow={openEmulatorWindow} />;
      case 'controllers':
        return <ControllerApp {...session} />;
      case 'profile':
        return <ProfileApp />;
      case 'emulator':
        return <EmulatorView isWindowed={true} {...session} />;
      case 'ads':
        return <AdApp />;
      case 'calc':
        return <PlaceholderApp name="Calculator" />;
      case 'notepad':
        return <PlaceholderApp name="Notepad" />;
      default:
        return null;
    }
  };

  const [activeWindow, setActiveWindow] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStartOpen, setIsStartOpen] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.target === e.currentTarget || (e.target as HTMLElement).id === 'desktop-area') {
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };
  
  const handleRefresh = () => {
    closeContextMenu();
    setIsStartOpen(false);
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 150);
  };

  const handleRootClick = () => {
    closeContextMenu();
    setIsStartOpen(false);
  };

  const openWindow = (id: string) => {
    setWindows(ws => ws.map(w => {
      if (w.id === id) {
        return { ...w, isOpen: true, isMinimized: false, zIndex: Math.max(0, ...ws.map(x => x.zIndex)) + 1 };
      }
      return w;
    }));
    setActiveWindow(id);
  };

  useEffect(() => {
    // If returning from Discord login (has access_token in hash)
    if (window.location.hash.includes('access_token')) {
      openWindow('profile');
    }
  }, []);

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
    <div 
      className="h-screen w-full bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center overflow-hidden flex flex-col font-sans relative"
      onClick={handleRootClick}
    >
      <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
      
      {/* Desktop Area */}
      <div 
        id="desktop-area"
        className="flex-1 relative p-6 z-10"
        onContextMenu={handleContextMenu}
      >
        {/* Desktop Icons */}
        <div className={`flex flex-col gap-6 w-24 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>
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
              className={`absolute top-4 left-4 right-4 bottom-16 sm:top-10 sm:left-32 sm:right-32 sm:bottom-10 bg-[#1c1c1c]/95 backdrop-blur-3xl border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${activeWindow === w.id ? 'ring-1 ring-white/20 shadow-[0_10px_60px_rgba(0,0,0,0.6)]' : 'opacity-90 grayscale-[0.2]'}`}
            >
              {/* Window Title Bar */}
              <div className="h-9 bg-transparent flex items-center justify-between select-none">
                <div className="flex items-center gap-3 text-slate-200 px-4">
                  <w.icon className="w-4 h-4 text-indigo-400 drop-shadow-sm" />
                  <span className="text-xs font-medium tracking-wide">{w.title}</span>
                </div>
                <div className="flex items-center h-full">
                  <button onClick={(e) => { e.stopPropagation(); minimizeWindow(w.id); }} className="w-12 h-full flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors"><Minus className="w-4 h-4" /></button>
                  <button className="w-12 h-full flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors"><Square className="w-3 h-3" /></button>
                  <button onClick={(e) => { e.stopPropagation(); closeWindow(w.id); }} className="w-12 h-full flex items-center justify-center text-slate-300 hover:bg-red-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </div>
              {/* Window Content */}
              <div className="flex-1 overflow-auto relative bg-[#121212] border-t border-white/5">
                {renderWindowContent(w.id)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Context Menu */}
        <AnimatePresence>
          {contextMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              style={{ left: contextMenu.x, top: contextMenu.y }}
              className="fixed z-[100] w-64 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl py-2 flex flex-col text-sm text-slate-200 overflow-hidden font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="flex items-center justify-between w-full px-4 py-2 hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors group">
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                  <span>View</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
              <button className="flex items-center justify-between w-full px-4 py-2 hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors group">
                <div className="flex items-center gap-3">
                  <FolderPlus className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                  <span>Sort by</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
              <button 
                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors group"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                <span>Refresh</span>
              </button>
              <div className="h-px bg-white/10 my-1 w-full" />
              <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors group">
                <FolderPlus className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                <span>New</span>
              </button>
              <div className="h-px bg-white/10 my-1 w-full" />
              <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors group">
                <MonitorSmartphone className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                <span>Display settings</span>
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors group">
                <Image className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                <span>Personalize</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Start Menu */}
      <AnimatePresence>
        {isStartOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[600px] h-[650px] bg-[#1c1c1c]/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 pb-4 flex-1 overflow-y-auto">
              <div className="flex items-center gap-4 bg-black/40 p-2.5 rounded-full border border-white/5 mb-8 shadow-inner">
                <Search className="w-5 h-5 text-slate-400 ml-2" />
                <input 
                  type="text" 
                  placeholder="Type here to search" 
                  className="bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 w-full font-medium"
                />
              </div>

              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-white font-semibold text-sm">Pinned</h3>
                <button className="text-xs bg-white/5 hover:bg-white/10 text-slate-200 px-3 py-1 rounded shadow-sm transition-colors flex items-center gap-1">All apps <ChevronRight className="w-3 h-3" /></button>
              </div>

              <div className="grid grid-cols-6 gap-y-6 gap-x-2">
                {windows.map(w => (
                  <button 
                    key={`start-${w.id}`}
                    onClick={() => { openWindow(w.id); setIsStartOpen(false); }}
                    className="flex flex-col items-center justify-start gap-2 p-2 hover:bg-white/10 rounded-xl transition-colors group"
                  >
                    <w.icon className="w-8 h-8 text-indigo-400 drop-shadow-md group-hover:scale-105 transition-transform" />
                    <span className="text-xs text-slate-200 text-center truncate w-full">{w.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-16 bg-black/30 border-t border-white/10 flex items-center justify-between px-8 rounded-b-2xl backdrop-blur-md">
              <div 
                className="flex items-center gap-3 hover:bg-white/10 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                onClick={() => { openWindow('profile'); setIsStartOpen(false); }}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
                  <User className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-slate-200">Cloud Profile</span>
              </div>
              <button className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-slate-300 hover:text-red-400">
                <Power className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <div className="h-12 bg-[#1c1c1c]/85 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between px-2 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3 pl-2 opacity-0 pointer-events-none w-32">
          {/* Spacer */}
        </div>
        
        <div className="flex items-center justify-center gap-1.5 flex-1">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsStartOpen(!isStartOpen); }}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all hover:bg-white/10 ${isStartOpen ? 'bg-white/15 shadow-inner' : ''}`}
          >
            <Windows11Icon className="w-5 h-5 drop-shadow-md" />
          </button>
          
          <div className="w-px h-5 bg-white/10 mx-1"></div>
          
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
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all hover:bg-white/10 relative ${activeWindow === w.id && !w.isMinimized ? 'bg-white/15' : ''}`}
            >
              <w.icon className={`w-5 h-5 drop-shadow-sm transition-transform ${activeWindow === w.id && !w.isMinimized ? 'text-white scale-110' : 'text-slate-300'}`} />
              <div className={`absolute bottom-0 h-1 rounded-t-full transition-all ${activeWindow === w.id && !w.isMinimized ? 'w-4 bg-indigo-400' : 'w-1.5 bg-slate-400 group-hover:w-3'}`}></div>
            </button>
          ))}
        </div>
        
        {/* System Tray */}
        <div className="flex items-center gap-1 pr-2 text-slate-200">
          <div className="w-6 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors cursor-pointer">
            <ChevronRight className="w-3 h-3 -rotate-90" />
          </div>
          <div className="flex items-center hover:bg-white/10 px-2 h-8 rounded transition-colors cursor-pointer gap-2">
            <Wifi className="w-4 h-4 drop-shadow-sm" />
            <Volume2 className="w-4 h-4 drop-shadow-sm" />
          </div>
          <div className="text-[11px] font-medium text-right flex flex-col justify-center hover:bg-white/10 px-2 h-10 rounded transition-colors cursor-pointer leading-tight">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
