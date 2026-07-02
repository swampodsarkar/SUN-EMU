import React, { useState, useRef, useEffect } from 'react';
import { Settings, Search, User, Play, Plus, Smartphone, X, Upload, Bell, Users, Trophy, Download, ShoppingBag, Power, Gamepad2, ChevronRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEmulatorSession } from '../lib/useEmulatorSession';
import type { SupportedCore } from '../types';
import { cn } from '../lib/utils';
import EmulatorView from './EmulatorView';
import ControllerApp from './ControllerApp';
import StoreApp from './StoreApp';
import AdminPanel from './AdminPanel';
import ExploreApp from './ExploreApp';
import SettingsApp from './SettingsApp';
import LoginModal from './LoginModal';
import { useStore } from '../lib/store';

const coreExtensions: Record<string, SupportedCore> = {
  ".nes": "nes", ".smc": "snes", ".sfc": "snes", ".n64": "n64", ".v64": "n64", ".z64": "n64",
  ".gb": "gb", ".gbc": "gbc", ".gba": "gba", ".nds": "nds", 
  ".md": "segaMD", ".gen": "segaMD", ".smd": "segaMD", ".sms": "sms", ".gg": "gg", 
  ".iso": "psx", ".bin": "psx", ".cue": "psx", ".img": "psx",
  ".a26": "atari2600", ".a52": "atari5200", ".a78": "atari7800", ".lnx": "lynx", ".j64": "jaguar",
  ".ngp": "ngp", ".ngc": "ngpc", ".pce": "pce", ".sgx": "pce",
  ".ws": "wswan", ".wsc": "wsc", ".vb": "vb", ".col": "coleco", ".rom": "msx", ".mxs": "msx",
  ".zip": "arcade", ".7z": "arcade"
};

interface AppItem {
  id: string;
  title: string;
  subtitle: string;
  developer?: string;
  bgGradient: string;
  logoText?: string;
  icon?: React.ReactNode;
  action?: () => void;
  type: 'game' | 'app' | 'system';
  progress?: number;
}

export default function OSView() {
  const session = useEmulatorSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const store = useStore();
  const { settings } = useStore();
  const themeClass = settings.darkMode ? "bg-black text-white" : "bg-gray-100 text-black";

  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);
  const [category, setCategory] = useState<'games'>('games');
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [showControllerModal, setShowControllerModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [bootSequence, setBootSequence] = useState(true);

  useEffect(() => { store.incrementGuestCount();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    setTimeout(() => setBootSequence(false), 2500);
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
    
    setActiveIndex(0);
  };

  const apps: AppItem[] = [
    ...(session.gameUrl ? [{
      id: 'active-game',
      title: session.gameName || 'Loaded Game',
      subtitle: 'PS5 Edition',
      developer: 'Sony Interactive Entertainment',
      bgGradient: 'from-blue-700 via-indigo-900 to-slate-900',
      icon: <Gamepad2 className="w-12 h-12 text-white" />,
      action: () => session.setIsPlaying(true),
      type: 'game' as const,
      progress: 42
    }] : []),
    {
      id: 'load-rom',
      title: 'Game Library',
      subtitle: 'Install from ROM File',
      developer: 'System',
      bgGradient: 'from-emerald-700 via-teal-900 to-slate-900',
      icon: <Upload className="w-10 h-10 text-white" />,
      action: () => fileInputRef.current?.click(),
      type: 'system'
    },
    {
      id: 'store',
      title: 'Store',
      subtitle: 'Discover New Games',
      bgGradient: 'from-orange-600 via-red-900 to-slate-900',
      icon: <ShoppingBag className="w-10 h-10 text-white" />,
      action: () => setShowStoreModal(true),
      type: 'system'
    },
    {
      id: 'controller',
      title: 'Accessories',
      subtitle: `Remote Controller Code: ${session.pairCode || 'Loading...'}`,
      developer: 'Hardware',
      bgGradient: 'from-slate-600 via-slate-800 to-black',
      icon: <Smartphone className="w-10 h-10 text-white" />,
      action: () => setShowControllerModal(true),
      type: 'system'
    },
    {
      id: 'explore',
      title: 'Explore',
      subtitle: 'Latest News & Updates',
      bgGradient: 'from-violet-700 via-fuchsia-900 to-slate-900',
      icon: <Menu className="w-10 h-10 text-white" />,
      action: () => setShowExploreModal(true),
      type: 'app'
    }
  ];

  const activeApp = apps[activeIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (session.isPlaying || showControllerModal || showStoreModal || showExploreModal || showSettingsModal || showLoginModal || showAdminPanel || bootSequence) return;
      
      if (e.key === 'ArrowRight') {
        setActiveIndex(prev => Math.min(prev + 1, apps.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        const currentApp = apps[activeIndex];
        if (currentApp && currentApp.action) {
           currentApp.action();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session.isPlaying, showControllerModal, bootSequence, activeIndex, apps]);

  if (bootSequence) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-24 h-24 rounded-full border-t-2 border-r-2 border-white animate-spin opacity-80" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-white font-bold text-3xl tracking-widest flex items-center gap-2"
          >
            <Gamepad2 className="w-8 h-8" />
            SUN EMULATOR
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-full bg-gradient-to-br ${settings.wallpaper} ${settings.darkMode ? "text-white" : "text-gray-900"} overflow-hidden flex flex-col font-sans relative selection:bg-white/30 transition-all duration-500`}>
      
      {/* Dynamic Background with Parallax and Blur */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeApp.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("absolute inset-0 z-0 bg-gradient-to-br opacity-40 transition-all", activeApp.bgGradient)}
        />
      </AnimatePresence>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-transparent to-black/95 pointer-events-none transition-all duration-1000" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Top Navigation Bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 flex items-center justify-between px-16 py-10"
      >
        <div className="flex items-center gap-10">
          <button 
            className="text-2xl font-medium cursor-pointer transition-all relative pb-2 group text-white"
          >
            Games
            <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full" />
          </button>
        </div>
        
        <div className="flex items-center gap-7">
          <button className="text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer bg-white/5 p-2.5 rounded-full hover:bg-white/10 backdrop-blur-md">
            <Search className="w-6 h-6" />
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer bg-white/5 p-2.5 rounded-full hover:bg-white/10 backdrop-blur-md">
            <Settings className="w-6 h-6" />
          </button>
          <button onClick={() => {
            if (store.currentUser) {
               if (store.currentUser.email === 'mdswampodsarkar@gmail.com') {
                  setShowAdminPanel(true);
               } else {
                  store.logout();
               }
            } else {
               setShowLoginModal(true);
            }
          }} className="flex items-center gap-3 bg-white/5 p-1.5 pr-4 rounded-full hover:bg-white/10 backdrop-blur-md transition-all border border-white/10 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center ring-2 ring-white/20">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className={`w-3 h-3 rounded-full ${store.currentUser ? 'bg-green-500' : 'bg-red-500'} relative`}>
               {store.currentUser && <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-50" />}
            </div>
          </button>
          <span className="text-xl font-medium opacity-90 tracking-wide tabular-nums">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-16 pb-24">
        
        {/* Game Title & Activity Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeApp.id}
            initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-12 max-w-2xl"
          >
            {activeApp.developer && (
              <p className="text-sm uppercase tracking-[0.2em] font-bold text-white/60 mb-2">
                {activeApp.developer}
              </p>
            )}
            <h1 className="text-6xl font-bold tracking-tight mb-4 drop-shadow-2xl text-white">
              {activeApp.title}
            </h1>
            <p className="text-2xl text-white/80 drop-shadow-md mb-8 font-light">
              {activeApp.subtitle}
            </p>

            {/* Play Button and Actions */}
            <div className="flex items-center gap-4">
              {activeApp.action && (
                <button 
                  onClick={activeApp.action}
                  className="bg-white text-black hover:bg-gray-200 px-10 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 group"
                >
                  {activeApp.type === 'game' ? (
                    <Play className="w-6 h-6 fill-current" />
                  ) : (
                    <Plus className="w-6 h-6" />
                  )}
                  {activeApp.type === 'game' ? 'Play Game' : 'Open'}
                </button>
              )}
              
              {activeApp.type === 'game' && activeApp.progress !== undefined && (
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-full flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-white/60 uppercase font-bold tracking-wider">Progress</span>
                    <span className="text-sm font-medium">{activeApp.progress}%</span>
                  </div>
                  <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full"
                      style={{ width: `${activeApp.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Horizontal App List - PS5 Style */}
        <div className="flex gap-4 items-center">
          {apps.map((app, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={app.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative group transition-all duration-300 ease-out focus:outline-none flex-shrink-0 origin-bottom rounded-2xl",
                  isActive ? "w-40 h-40 z-20 mx-2 scale-110" : "w-28 h-28 opacity-80 hover:opacity-100 z-10 hover:scale-105"
                )}
              >
                <div className={cn(
                  "w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl overflow-hidden",
                  isActive ? "ring-4 ring-white shadow-[0_0_50px_rgba(255,255,255,0.3)]" : "ring-1 ring-white/10 hover:ring-white/30"
                )}>
                  {/* Tile Background */}
                  <div 
                    className={cn("absolute inset-0 transition-transform duration-700 group-hover:scale-110 bg-gradient-to-br", app.bgGradient)}
                  />
                  <div className={cn(
                    "absolute inset-0 transition-colors duration-300",
                    isActive ? "bg-black/10" : "bg-black/40 group-hover:bg-black/20"
                  )} />
                  
                  {/* Icon */}
                  <div className={cn(
                    "relative z-10 drop-shadow-2xl transition-transform duration-300",
                    isActive ? "scale-110" : "scale-100"
                  )}>
                    {app.icon}
                  </div>
                </div>
                
                {/* Active Indicator Underneath */}
                {isActive && (
                  <motion.div 
                    layoutId="active-app-indicator"
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Bar (PS Button Menu Prompt) */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
        <button 
          onClick={() => setShowPowerMenu(!showPowerMenu)}
          className="bg-black/50 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full flex items-center gap-8 shadow-2xl hover:bg-black/70 transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-sm font-medium">Control Center</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-6 text-white/50">
            <Bell className="w-5 h-5 hover:text-white transition-colors" />
            <Users className="w-5 h-5 hover:text-white transition-colors" />
            <Download className="w-5 h-5 hover:text-white transition-colors" />
            <Trophy className="w-5 h-5 hover:text-white transition-colors" />
            <Power className="w-5 h-5 hover:text-red-400 transition-colors" />
          </div>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept=".nes,.smc,.sfc,.gb,.gbc,.gba,.nds,.md,.gen,.sms,.gg,.iso,.bin,.a26,.zip"
      />

      {/* Emulator Overlay with Glassmorphism transitions */}
      <AnimatePresence>
        {showControllerModal && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[120] bg-black"
          >
            <button 
              onClick={() => setShowControllerModal(false)}
              className="absolute top-8 right-8 z-[130] bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full backdrop-blur-md transition-all shadow-lg group"
            >
              <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <ControllerApp pairCode={session.pairCode} controllers={session.controllers} />
          </motion.div>
        )}

        
        {showExploreModal && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[120] bg-black"
          >
            <button 
              onClick={() => setShowExploreModal(false)}
              className="absolute top-8 right-8 z-[130] bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full backdrop-blur-md transition-all shadow-lg group"
            >
              <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <ExploreApp />
          </motion.div>
        )}

        {showSettingsModal && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[120] bg-black"
          >
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-8 right-8 z-[130] bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full backdrop-blur-md transition-all shadow-lg group"
            >
              <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <SettingsApp />
          </motion.div>
        )}

        {showStoreModal && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[120] bg-black"
          >
            <button 
              onClick={() => setShowStoreModal(false)}
              className="absolute top-8 right-8 z-[130] bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full backdrop-blur-md transition-all shadow-lg group"
            >
              <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <StoreApp 
              onPlayGame={(name, url, core) => {
                session.setGameName(name);
                session.setGameUrl(url);
                session.setCore(core as any);
                setShowStoreModal(false);
                setTimeout(() => session.setIsPlaying(true), 300);
              }} 
            />
          </motion.div>
        )}

        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)} 
            onLoginSuccess={(email) => {
              setShowLoginModal(false);
              if (email === 'mdswampodsarkar@gmail.com') {
                setShowAdminPanel(true);
              }
            }}
          />
        )}

        {showAdminPanel && (
          <AdminPanel onClose={() => setShowAdminPanel(false)} />
        )}

        {session.isPlaying && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col"
          >
            {/* Minimalist Top Bar for Emulator */}
            <div className="h-16 flex items-center justify-between px-6 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-4 text-white">
                <Gamepad2 className="w-6 h-6 opacity-50" />
                <span className="font-medium tracking-wide opacity-80">{session.gameName || 'Playing'}</span>
              </div>
              <button 
                onClick={() => session.setIsPlaying(false)}
                className="bg-white/10 hover:bg-red-500/90 text-white px-6 py-2 rounded-full backdrop-blur-md border border-white/10 transition-all shadow-lg flex items-center gap-2 group text-sm font-bold"
              >
                <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Close Game
              </button>
            </div>
            
            <div className="flex-1 w-full h-full p-0">
              <EmulatorView 
                isWindowed={false} 
                isPlaying={session.isPlaying} 
                iframeRef={session.iframeRef} 
                gameUrl={session.gameUrl}
                core={session.core}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
