import React, { useState, useRef, useEffect } from 'react';
import { Settings, Search, User, Play, Plus, Smartphone, X, Upload, Bell, Users, Trophy, Download, ShoppingBag, Power, Gamepad2, ChevronRight, Menu, RefreshCw, LogOut, Copy, Check, ExternalLink, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
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
  const [controlCenterTab, setControlCenterTab] = useState<'notifications' | 'users' | 'downloads' | 'achievements' | 'power'>('notifications');
  const [showControllerModal, setShowControllerModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showPairingDropdown, setShowPairingDropdown] = useState(false);
  const [showGamePairingDropdown, setShowGamePairingDropdown] = useState(false);
  const [bootSequence, setBootSequence] = useState(true);
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  useEffect(() => { store.incrementGuestCount();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    setTimeout(() => setBootSequence(false), 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ESC_PRESSED') {
        if (session.isPlaying) {
          setShowPauseMenu(prev => !prev);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (session.isPlaying) {
          e.preventDefault();
          setShowPauseMenu(prev => !prev);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [session.isPlaying]);

  const [showMultiplayerHub, setShowMultiplayerHub] = useState(false);
  const [simulatedSlots, setSimulatedSlots] = useState<number[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const simulatedInputsRef = useRef<Record<number, Record<string, boolean>>>({
    2: {},
    3: {},
    4: {}
  });

  const LOCAL_MAPPINGS: Record<number, Record<string, string>> = {
    2: {
      "KeyW": "ArrowUp",
      "KeyS": "ArrowDown",
      "KeyA": "ArrowLeft",
      "KeyD": "ArrowRight",
      "KeyT": "Shift", // Select
      "KeyY": "Enter", // Start
      "KeyF": "z",     // B
      "KeyG": "x",     // A
      "KeyR": "a",     // Y
      "KeyV": "s",     // X
      "KeyQ": "q",     // L1
      "KeyE": "w"      // R1
    },
    3: {
      "KeyI": "ArrowUp",
      "KeyK": "ArrowDown",
      "KeyJ": "ArrowLeft",
      "KeyL": "ArrowRight",
      "KeyO": "Shift", // Select
      "KeyP": "Enter", // Start
      "Comma": "z",    // B
      "Period": "x",   // A
      "Semicolon": "a",// Y
      "Quote": "s",    // X
      "KeyU": "q",     // L1
      "KeyH": "w"      // R1
    },
    4: {
      "Numpad8": "ArrowUp",
      "Numpad2": "ArrowDown",
      "Numpad4": "ArrowLeft",
      "Numpad6": "ArrowRight",
      "NumpadDivide": "Shift",
      "NumpadMultiply": "Enter",
      "Numpad1": "z",
      "Numpad3": "x",
      "Numpad7": "a",
      "Numpad9": "s",
      "NumpadSubtract": "q",
      "NumpadAdd": "w"
    }
  };

  useEffect(() => {
    if (!session.isPlaying) return;

    const handleLocalKeyDown = (e: KeyboardEvent) => {
      // Avoid capturing inside inputs
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      [2, 3, 4].forEach(slot => {
        if (simulatedSlots.includes(slot)) {
          const mapping = LOCAL_MAPPINGS[slot];
          if (mapping && mapping[e.code]) {
            e.preventDefault();
            const emulatorKey = mapping[e.code];
            if (!simulatedInputsRef.current[slot]) {
              simulatedInputsRef.current[slot] = {};
            }
            simulatedInputsRef.current[slot][emulatorKey] = true;

            if (session.iframeRef.current && session.iframeRef.current.contentWindow) {
              session.iframeRef.current.contentWindow.postMessage({
                type: 'CONTROLLER_INPUT',
                playerSlot: slot,
                inputs: { ...simulatedInputsRef.current[slot] }
              }, '*');
            }
          }
        }
      });
    };

    const handleLocalKeyUp = (e: KeyboardEvent) => {
      [2, 3, 4].forEach(slot => {
        if (simulatedSlots.includes(slot)) {
          const mapping = LOCAL_MAPPINGS[slot];
          if (mapping && mapping[e.code]) {
            const emulatorKey = mapping[e.code];
            if (simulatedInputsRef.current[slot]) {
              simulatedInputsRef.current[slot][emulatorKey] = false;
            }

            if (session.iframeRef.current && session.iframeRef.current.contentWindow) {
              session.iframeRef.current.contentWindow.postMessage({
                type: 'CONTROLLER_INPUT',
                playerSlot: slot,
                inputs: { ...simulatedInputsRef.current[slot] }
              }, '*');
            }
          }
        }
      });
    };

    window.addEventListener('keydown', handleLocalKeyDown, true);
    window.addEventListener('keyup', handleLocalKeyUp, true);

    let iframeWin: Window | null = null;
    try {
      if (session.iframeRef.current && session.iframeRef.current.contentWindow) {
        iframeWin = session.iframeRef.current.contentWindow;
        iframeWin.addEventListener('keydown', handleLocalKeyDown, true);
        iframeWin.addEventListener('keyup', handleLocalKeyUp, true);
      }
    } catch (err) {
      console.warn("Could not attach key listeners to iframe directly:", err);
    }

    return () => {
      window.removeEventListener('keydown', handleLocalKeyDown, true);
      window.removeEventListener('keyup', handleLocalKeyUp, true);
      if (iframeWin) {
        try {
          iframeWin.removeEventListener('keydown', handleLocalKeyDown, true);
          iframeWin.removeEventListener('keyup', handleLocalKeyUp, true);
        } catch (e) {}
      }
    };
  }, [session.isPlaying, simulatedSlots]);

  useEffect(() => {
    if (!session.isPlaying) {
      setShowPauseMenu(false);
      setShowMultiplayerHub(false);
      setSimulatedSlots([]);
    }
  }, [session.isPlaying]);

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
      subtitle: 'Currently Playing',
      developer: 'Emulator Core',
      bgGradient: 'from-blue-700 via-indigo-900 to-slate-900',
      icon: <Gamepad2 className="w-12 h-12 text-white" />,
      action: () => session.setIsPlaying(true),
      type: 'game' as const,
      progress: 42
    }] : []),
    ...store.games
      .filter(game => store.downloadedGameIds?.includes(game.id))
      .map(game => ({
        id: `downloaded-game-${game.id}`,
        title: game.name,
        subtitle: `${game.size} • Ready to Play`,
        developer: `${game.core.toUpperCase()} Core`,
        bgGradient: 'from-sky-700 via-indigo-950 to-slate-950',
        icon: game.coverImage ? (
          <img src={game.coverImage} alt={game.name} className="w-12 h-12 object-cover rounded-xl" />
        ) : (
          <Gamepad2 className="w-10 h-10 text-white" />
        ),
        action: () => {
          session.setGameName(game.name);
          session.setGameUrl(game.rawLink);
          session.setCore(game.core as any);
          setTimeout(() => session.setIsPlaying(true), 100);
        },
        type: 'game' as const,
        progress: 0
      })),
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
          {/* QR Code & Pair Code Instant Controller Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowPairingDropdown(!showPairingDropdown)}
              className="flex items-center gap-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-4 py-2.5 rounded-full text-indigo-300 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.15)] backdrop-blur-md animate-pulse hover:animate-none"
            >
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>Connect Controller: <span className="font-mono bg-indigo-500/20 px-2.5 py-1 rounded text-white ml-1.5 border border-indigo-400/20">{session.pairCode || '------'}</span></span>
            </button>
            
            <AnimatePresence>
              {showPairingDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 bg-slate-950/95 border border-white/10 backdrop-blur-3xl rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[150] text-white"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-base text-indigo-300 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-indigo-400" />
                      Play with Friends
                    </h3>
                    <button 
                      onClick={() => setShowPairingDropdown(false)}
                      className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-white/60 mb-5 leading-relaxed text-center">
                    Scan this QR code with a phone camera to join instantly as a controller and play together!
                  </p>
                  
                  <div className="bg-white p-4 rounded-2xl mb-4 flex items-center justify-center aspect-square max-w-[170px] mx-auto shadow-[0_0_30px_rgba(255,255,255,0.1)] ring-1 ring-white/10">
                    <QRCodeSVG 
                      value={`${window.location.origin}/controller/${session.pairCode}`} 
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  
                  <div className="text-center font-mono font-bold text-3xl tracking-widest bg-white/5 py-3 rounded-2xl mb-4 border border-white/10 shadow-inner select-all" title="Click to select code">
                    {session.pairCode}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-white/50 border-t border-white/5 pt-4">
                    <span>Connected Controllers:</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {session.controllers.length} Connected
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer bg-white/5 p-2.5 rounded-full hover:bg-white/10 backdrop-blur-md">
            <Search className="w-6 h-6" />
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer bg-white/5 p-2.5 rounded-full hover:bg-white/10 backdrop-blur-md">
            <Settings className="w-6 h-6" />
          </button>
          <button onClick={() => {
            if (store.currentUser) {
               if (store.currentUser.email.trim().toLowerCase() === 'mdswampodsarkar@gmail.com') {
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

      {/* Control Center Overlay Panel */}
      <AnimatePresence>
        {showPowerMenu && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-xl h-[460px] bg-slate-950/95 backdrop-blur-3xl border border-white/15 rounded-[2rem] p-6 shadow-[0_0_50px_rgba(0,0,0,0.85)] text-white z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-6 h-6 text-indigo-400" />
                <h3 className="font-bold text-lg uppercase tracking-wider text-white/90">Control Center</h3>
              </div>
              <button 
                onClick={() => setShowPowerMenu(false)}
                className="bg-white/10 hover:bg-white/25 p-1.5 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Tab Selector */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/5 mb-4 shrink-0">
              <button
                onClick={() => setControlCenterTab('notifications')}
                className={cn(
                  "flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer",
                  controlCenterTab === 'notifications' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"
                )}
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">News</span>
              </button>
              <button
                onClick={() => setControlCenterTab('users')}
                className={cn(
                  "flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer",
                  controlCenterTab === 'users' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"
                )}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Users</span>
              </button>
              <button
                onClick={() => setControlCenterTab('downloads')}
                className={cn(
                  "flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer",
                  controlCenterTab === 'downloads' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"
                )}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Library</span>
              </button>
              <button
                onClick={() => setControlCenterTab('achievements')}
                className={cn(
                  "flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer",
                  controlCenterTab === 'achievements' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"
                )}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Trophies</span>
              </button>
              <button
                onClick={() => setControlCenterTab('power')}
                className={cn(
                  "flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer",
                  controlCenterTab === 'power' ? "bg-red-600 text-white shadow-lg" : "text-white/60 hover:text-red-400"
                )}
              >
                <Power className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Power</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto pr-1 select-none">
              {controlCenterTab === 'notifications' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-white/40 uppercase font-bold tracking-widest">Announcements</span>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">{store.news.length} Broadcasts</span>
                  </div>
                  {store.news.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-white/30 text-center">
                      <Bell className="w-12 h-12 mb-3 stroke-[1.5]" />
                      <p className="text-sm font-medium">No announcements found</p>
                      <p className="text-xs text-white/40 mt-1">Check back later for system updates</p>
                    </div>
                  ) : (
                    [...store.news].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(item => (
                      <div key={item.id} className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all">
                        <h4 className="font-bold text-base mb-1 text-indigo-200">{item.title}</h4>
                        <p className="text-xs text-white/70 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                        <span className="text-[10px] text-white/30 block mt-2 font-mono">
                          {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {controlCenterTab === 'users' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col">
                      <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Registered Accounts</span>
                      <span className="text-2xl font-bold mt-1 text-blue-400">{store.users.length}</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col">
                      <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Active Guest Sessions</span>
                      <span className="text-2xl font-bold mt-1 text-emerald-400">{store.guestCount}</span>
                    </div>
                  </div>

                  <span className="text-xs text-white/40 uppercase font-bold tracking-widest block mb-2">System Users</span>
                  <div className="space-y-2">
                    {store.users.map(u => {
                      const isAdmin = u.email.trim().toLowerCase() === 'mdswampodsarkar@gmail.com';
                      return (
                        <div key={u.email} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-xs text-indigo-300">
                              {u.email.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium truncate max-w-[240px]">{u.email}</span>
                              <span className="text-[10px] text-white/40 font-mono">
                                {isAdmin ? 'System Owner' : u.banned ? 'Banned' : 'Regular User'}
                              </span>
                            </div>
                          </div>
                          <div>
                            {isAdmin ? (
                              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Admin</span>
                            ) : u.banned ? (
                              <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Banned</span>
                            ) : (
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Active</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {controlCenterTab === 'downloads' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-white/40 uppercase font-bold tracking-widest">My Game Library</span>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">{store.downloadedGameIds?.length || 0} Installed</span>
                  </div>

                  {(!store.downloadedGameIds || store.downloadedGameIds.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-12 text-white/30 text-center">
                      <Download className="w-12 h-12 mb-3 stroke-[1.5]" />
                      <p className="text-sm font-medium">No downloaded games yet</p>
                      <p className="text-xs text-white/40 mt-1 mb-4">You can download free games from the built-in Store</p>
                      <button 
                        onClick={() => {
                          setShowPowerMenu(false);
                          setShowStoreModal(true);
                        }}
                        className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs hover:bg-gray-200 transition-all cursor-pointer"
                      >
                        Open Game Store
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {store.games
                        .filter(g => store.downloadedGameIds.includes(g.id))
                        .map(game => (
                          <div key={game.id} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center justify-between hover:border-white/10 transition-all">
                            <div className="flex items-center gap-3">
                              {game.coverImage ? (
                                <img src={game.coverImage} alt={game.name} className="w-12 h-12 object-cover rounded-xl" />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-300">
                                  <Gamepad2 className="w-6 h-6" />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-sm font-bold truncate max-w-[200px]">{game.name}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold text-white/60">{game.core}</span>
                                  <span className="text-[10px] text-white/40 font-medium">{game.size}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                store.playGame(game.id);
                                session.setGameName(game.name);
                                session.setGameUrl(game.rawLink);
                                session.setCore(game.core as any);
                                setShowPowerMenu(false);
                                setTimeout(() => session.setIsPlaying(true), 150);
                              }}
                              className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              Play
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {controlCenterTab === 'achievements' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-white/40 uppercase font-bold tracking-widest">System Achievements</span>
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                      {store.achievements.filter(a => a.unlocked).length} / {store.achievements.length} Unlocked
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {store.achievements.map(ach => (
                      <div 
                        key={ach.id} 
                        className={cn(
                          "border rounded-2xl p-4 flex items-center gap-4 transition-all",
                          ach.unlocked 
                            ? "bg-amber-500/5 border-amber-500/20" 
                            : "bg-white/5 border-white/5 opacity-60"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                          ach.unlocked 
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                            : "bg-white/5 text-white/30 border-white/10"
                        )}>
                          <Trophy className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className={cn("font-bold text-sm truncate", ach.unlocked ? "text-amber-200" : "text-white")}>
                              {ach.title}
                            </h4>
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", ach.unlocked ? "bg-amber-500/20 text-amber-300" : "bg-white/10 text-white/40")}>
                              {ach.unlocked ? 'Unlocked' : 'Locked'}
                            </span>
                          </div>
                          <p className="text-xs text-white/60 leading-tight mb-2">{ach.desc}</p>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full transition-all duration-500", ach.unlocked ? "bg-amber-500" : "bg-white/20")}
                              style={{ width: `${ach.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {controlCenterTab === 'power' && (
                <div className="space-y-5 animate-fade-in">
                  <span className="text-xs text-white/40 uppercase font-bold tracking-widest block mb-2">System Power Controls</span>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {/* Log Out Option */}
                    {store.currentUser ? (
                      <button
                        onClick={() => {
                          store.logout();
                          setShowPowerMenu(false);
                        }}
                        className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                            <LogOut className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white">Log Out Account</h4>
                            <p className="text-xs text-white/40">Sign out of {store.currentUser.email}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowPowerMenu(false);
                          setShowLoginModal(true);
                        }}
                        className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white">Log In Account</h4>
                            <p className="text-xs text-white/40">Connect to your personal online account</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                      </button>
                    )}

                    {/* Reboot System */}
                    <button
                      onClick={() => {
                        setShowPowerMenu(false);
                        setBootSequence(true);
                        setTimeout(() => setBootSequence(false), 2000);
                      }}
                      className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <RefreshCw className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">Reboot Emulator OS</h4>
                          <p className="text-xs text-white/40">Warm restart of emulator environment</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                    </button>

                    {/* Shutdown / Reset States */}
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to perform a factory reset? This will clear downloaded games and restore system settings.")) {
                          // Clear downloaded games in local storage or store
                          useStore.setState({ downloadedGameIds: [] });
                          setShowPowerMenu(false);
                          setBootSequence(true);
                          setTimeout(() => setBootSequence(false), 2500);
                        }
                      }}
                      className="bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl p-4 flex items-center justify-between text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                          <Power className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-red-300">Factory Reset</h4>
                          <p className="text-xs text-red-500/50">Wipe cache and restore defaults</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-red-500/30 group-hover:text-red-400 transition-colors" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Status Bar (PS Button Menu Prompt) */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
        <div 
          onClick={() => setShowPowerMenu(!showPowerMenu)}
          className="bg-black/50 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full flex items-center gap-8 shadow-2xl hover:bg-black/70 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-sm font-medium">Control Center</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-6 text-white/50">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setControlCenterTab('notifications');
                setShowPowerMenu(true);
              }}
              className={cn("hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/10 flex items-center justify-center", controlCenterTab === 'notifications' && showPowerMenu ? "text-blue-400 bg-white/5" : "")}
            >
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setControlCenterTab('users');
                setShowPowerMenu(true);
              }}
              className={cn("hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/10 flex items-center justify-center", controlCenterTab === 'users' && showPowerMenu ? "text-blue-400 bg-white/5" : "")}
            >
              <Users className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setControlCenterTab('downloads');
                setShowPowerMenu(true);
              }}
              className={cn("hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/10 flex items-center justify-center", controlCenterTab === 'downloads' && showPowerMenu ? "text-blue-400 bg-white/5" : "")}
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setControlCenterTab('achievements');
                setShowPowerMenu(true);
              }}
              className={cn("hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/10 flex items-center justify-center", controlCenterTab === 'achievements' && showPowerMenu ? "text-blue-400 bg-white/5" : "")}
            >
              <Trophy className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setControlCenterTab('power');
                setShowPowerMenu(true);
              }}
              className={cn("hover:text-red-400 transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/10 flex items-center justify-center", controlCenterTab === 'power' && showPowerMenu ? "text-red-500 bg-white/5" : "")}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>
        </div>
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
              if (email.trim().toLowerCase() === 'mdswampodsarkar@gmail.com') {
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] w-full h-full bg-black overflow-hidden"
          >
            {/* 100% Fullscreen Emulator Container */}
            <div className="absolute inset-0 w-full h-full z-10 bg-black">
              <EmulatorView 
                isWindowed={false} 
                isPlaying={session.isPlaying} 
                iframeRef={session.iframeRef} 
                gameUrl={session.gameUrl}
                core={session.core}
              />
            </div>

            {/* Top Interactive Control Bar */}
            <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-center select-none pointer-events-auto">
              {/* Multiplayer Hub Trigger */}
              <button
                onClick={() => {
                  setShowMultiplayerHub(prev => !prev);
                  // Focus iframe so it doesn't get stuck if we click away
                  if (showMultiplayerHub && session.iframeRef.current) {
                    session.iframeRef.current.focus();
                  }
                }}
                className={cn(
                  "bg-black/80 hover:bg-black/95 backdrop-blur-md px-4.5 py-2.5 rounded-full text-xs font-bold border flex items-center gap-2.5 transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-95",
                  showMultiplayerHub 
                    ? "border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]" 
                    : "border-white/10 text-white/90"
                )}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>👥 Multiplayer Setup ({1 + session.controllers.length + simulatedSlots.length}/4)</span>
                {session.controllers.length + simulatedSlots.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                )}
              </button>

              {/* Pause & Escape Hints */}
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline bg-black/60 backdrop-blur-md text-white/40 px-3 py-2 rounded-full text-[10px] font-mono tracking-wider border border-white/5 uppercase">
                  ESC to Pause & Quit
                </span>
                <button
                  onClick={() => setShowPauseMenu(true)}
                  className="bg-black/80 hover:bg-black/95 text-red-400 hover:text-red-300 backdrop-blur-md px-4.5 py-2.5 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2 transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-95"
                >
                  <Power className="w-3.5 h-3.5 text-red-500" />
                  <span>Quit Game</span>
                </button>
              </div>
            </div>

            {/* Multiplayer Hub Overlay Screen */}
            <AnimatePresence>
              {showMultiplayerHub && (
                <motion.div
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
                  exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 z-20 bg-slate-950/80 flex items-center justify-center p-4 md:p-8"
                  onClick={() => setShowMultiplayerHub(false)}
                >
                  {/* Glassmorphic Panel content container */}
                  <motion.div
                    initial={{ scale: 0.95, y: 15, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 15, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-full max-w-4xl bg-slate-950/95 border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-white relative overflow-y-auto max-h-[90vh] md:max-h-[85vh] backdrop-blur-3xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Abstract colorful gradients in background */}
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Close button inside the card */}
                    <button
                      onClick={() => setShowMultiplayerHub(false)}
                      className="absolute top-6 right-6 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white p-3 rounded-full border border-white/5 transition-all active:scale-90"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <Users className="w-3.5 h-3.5" />
                        MULTIPLAYER CENTRAL & LOCAL PLAY
                      </div>
                      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        Connect up to 4 Players
                      </h2>
                      <p className="text-sm text-slate-400 mt-1 max-w-xl">
                        Scan with your phone to use it as a gamepad, launch multiple local controller tabs, or enable local keyboard mapping to play together instantly on one screen!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left: Players Slots Configurator (8 cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-2">PLAYER SLOTS</h3>
                        {[1, 2, 3, 4].map((slot) => {
                          // Find active controller for this slot from Firebase
                          const remoteCtrl = session.controllers.find((c: any) => c.playerSlot === slot);
                          const isSimulated = simulatedSlots.includes(slot);
                          
                          let slotStatus = "Empty Slot";
                          let bgClass = "bg-white/5 border-white/5";
                          let tagColor = "bg-slate-800 text-slate-400";
                          
                          if (slot === 1) {
                            slotStatus = "Active (Host Keyboard)";
                            bgClass = "bg-indigo-500/5 border-indigo-500/20";
                            tagColor = "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";
                          } else if (remoteCtrl) {
                            slotStatus = "📱 Phone Connected";
                            bgClass = "bg-emerald-500/5 border-emerald-500/20";
                            tagColor = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
                          } else if (isSimulated) {
                            slotStatus = "⌨️ Local Keyboard Active";
                            bgClass = "bg-amber-500/5 border-amber-500/20";
                            tagColor = "bg-amber-500/20 text-amber-300 border border-amber-500/30";
                          }

                          return (
                            <div key={slot} className={cn("border rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all", bgClass)}>
                              {/* Player Info */}
                              <div className="flex items-center gap-3.5">
                                <div className={cn("px-3.5 py-1 rounded-xl text-xs font-black", tagColor)}>
                                  P{slot}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm text-slate-200">
                                    {slot === 1 ? "Player 1 (Host)" : `Player ${slot}`}
                                  </span>
                                  <span className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                                    {slotStatus}
                                  </span>
                                </div>
                              </div>

                              {/* Action controls */}
                              <div className="flex items-center gap-2">
                                {slot === 1 ? (
                                  <span className="text-[10px] text-slate-500 font-mono">Default bindings enabled</span>
                                ) : remoteCtrl ? (
                                  <button
                                    onClick={() => {
                                      // Disconnect mobile controller physically
                                      // (They can just close their browser, but we let users force-clear it)
                                    }}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                                  >
                                    Kick Slot
                                  </button>
                                ) : isSimulated ? (
                                  <button
                                    onClick={() => {
                                      setSimulatedSlots(prev => prev.filter(s => s !== slot));
                                      // Clean simulated inputs
                                      simulatedInputsRef.current[slot] = {};
                                      if (session.iframeRef.current && session.iframeRef.current.contentWindow) {
                                        session.iframeRef.current.contentWindow.postMessage({
                                          type: 'CONTROLLER_INPUT',
                                          playerSlot: slot,
                                          inputs: null
                                        }, '*');
                                      }
                                    }}
                                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/25 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                  >
                                    Disable Keyboard Map
                                  </button>
                                ) : (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setSimulatedSlots(prev => [...prev, slot]);
                                      }}
                                      className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                    >
                                      <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                                      Use Keyboard
                                    </button>
                                    <button
                                      onClick={() => {
                                        const url = `/controller/${session.pairCode}`;
                                        window.open(url, '_blank');
                                      }}
                                      className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                      Launch Tab
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Keyboard bindings cheat sheet */}
                        {simulatedSlots.length > 0 && (
                          <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3">
                            <h4 className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                              <Keyboard className="w-4 h-4 text-amber-400" />
                              LOCAL MULTIPLAYER KEYBOARD SCHEME
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {simulatedSlots.includes(2) && (
                                <div className="space-y-1 bg-white/5 p-3 rounded-xl">
                                  <span className="font-extrabold text-emerald-400">Player 2 Keys:</span>
                                  <ul className="text-slate-400 space-y-0.5 font-mono text-[10px]">
                                    <li>• Movement: <span className="text-white">W, A, S, D</span></li>
                                    <li>• Face Buttons (B/A/Y/X): <span className="text-white">F, G, R, V</span></li>
                                    <li>• Triggers (L1/R1): <span className="text-white">Q, E</span></li>
                                    <li>• Start / Select: <span className="text-white">Y / T</span></li>
                                  </ul>
                                </div>
                              )}
                              {simulatedSlots.includes(3) && (
                                <div className="space-y-1 bg-white/5 p-3 rounded-xl">
                                  <span className="font-extrabold text-rose-400">Player 3 Keys:</span>
                                  <ul className="text-slate-400 space-y-0.5 font-mono text-[10px]">
                                    <li>• Movement: <span className="text-white">I, J, K, L</span></li>
                                    <li>• Face Buttons (B/A/Y/X): <span className="text-white">Comma(,), Period(.), Semicolon(;), Quote(')</span></li>
                                    <li>• Triggers (L1/R1): <span className="text-white">U, H</span></li>
                                    <li>• Start / Select: <span className="text-white">P / O</span></li>
                                  </ul>
                                </div>
                              )}
                              {simulatedSlots.includes(4) && (
                                <div className="space-y-1 bg-white/5 p-3 rounded-xl">
                                  <span className="font-extrabold text-amber-400">Player 4 Keys:</span>
                                  <ul className="text-slate-400 space-y-0.5 font-mono text-[10px]">
                                    <li>• Movement: <span className="text-white">Num 8, 4, 2, 6</span></li>
                                    <li>• Face Buttons (B/A/Y/X): <span className="text-white">Num 1, 3, 7, 9</span></li>
                                    <li>• Triggers (L1/R1): <span className="text-white">Num -, +</span></li>
                                    <li>• Start / Select: <span className="text-white">Num *, /</span></li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Phone Scanner / QR Code (5 cols) */}
                      <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white/5 border border-white/5 p-6 rounded-3xl text-center">
                        <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-4">PHONE CONNECT</h3>
                        
                        <div className="bg-white p-4.5 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.2)] mb-4">
                          <QRCodeSVG 
                            value={`${window.location.origin}/controller/${session.pairCode}`}
                            size={164}
                            bgColor="#ffffff"
                            fgColor="#020617"
                            level="H"
                            includeMargin={false}
                          />
                        </div>

                        <div className="space-y-2 max-w-sm mb-5">
                          <span className="text-xs text-white/40 block">Scan to instantly connect mobile controllers</span>
                          <span className="font-mono text-2xl font-black tracking-widest text-indigo-400 select-all block">{session.pairCode}</span>
                        </div>

                        <div className="w-full flex flex-col gap-2">
                          <button
                            onClick={() => {
                              const shareUrl = `${window.location.origin}/controller/${session.pairCode}`;
                              navigator.clipboard.writeText(shareUrl);
                              setCopiedLink(true);
                              setTimeout(() => setCopiedLink(false), 2000);
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                          >
                            {copiedLink ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-400" />
                                Link Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy Controller URL
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Footer instructions */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-center text-[11px] text-slate-500 leading-relaxed">
                      All connected devices and simulated players instantly communicate through Firebase Realtime Database and the Emulator's native HTML5 Gamepad APIs. Maximize performance by keeping a stable internet connection.
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Premium Glassmorphic Escape Pause Menu Overlay */}
            <AnimatePresence>
              {showPauseMenu && (
                <motion.div
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                  exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-[150] bg-black/85 flex items-center justify-center p-4 md:p-6"
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 15, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 15, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-full max-w-2xl bg-slate-950/95 border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] text-white relative overflow-hidden backdrop-blur-3xl"
                  >
                    {/* Glowing design background accents */}
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Pause Header */}
                    <div className="text-center mb-6 relative z-10">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        <Gamepad2 className="w-4 h-4" />
                        EXIT GAME CONFIRMATION
                      </div>
                      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Quit {session.gameName || 'Active Game'}?
                      </h2>
                      <p className="text-xs text-white/40 mt-1 font-mono uppercase tracking-widest">
                        Core: {session.core?.toUpperCase()}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center mb-8 relative z-10 max-w-md mx-auto">
                      <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                        Are you sure you want to stop playing this game and exit back to the console menu? All unsaved progress will be lost.
                      </p>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 max-w-lg mx-auto">
                      <button
                        onClick={() => setShowPauseMenu(false)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(99,102,241,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 shrink-0 fill-current text-white" />
                        <span className="text-sm">Keep Playing</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowPauseMenu(false);
                          session.setIsPlaying(false);
                        }}
                        className="w-full bg-red-600 hover:bg-red-500 border border-red-400/30 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(239,68,68,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span className="text-sm">Exit Game</span>
                      </button>
                    </div>

                    {/* QR Code and Multi-player Pairing inside a neat sub-drawer */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center justify-center relative z-10">
                      <div className="flex items-center gap-2 text-xs text-indigo-300 font-bold mb-3">
                        <Smartphone className="w-4 h-4" />
                        <span>Pair wireless controller:</span>
                        <span className="font-mono bg-indigo-500/20 px-2 py-0.5 rounded text-white text-[10px] tracking-widest">{session.pairCode}</span>
                      </div>
                      <div className="flex gap-2 items-center text-[10px] text-white/40">
                        <span>Scan the pairing QR Code from the settings dropdown on the home console.</span>
                      </div>
                    </div>

                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
