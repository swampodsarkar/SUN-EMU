import React, { useState } from 'react';
import { Gamepad2, FolderOpen, Smartphone, Play, ArrowLeft, X, Minus, Settings, User } from 'lucide-react';
import EmulatorView from './EmulatorView';
import FileExplorerApp from './FileExplorerApp';
import ControllerApp from './ControllerApp';
import { useEmulatorSession } from '../lib/useEmulatorSession';
import { motion, AnimatePresence } from 'motion/react';

type View = 'dashboard' | 'library' | 'controller' | 'emulator';

export default function OSView() {
  const session = useEmulatorSession();
  const [view, setView] = useState<View>('dashboard');
  const [previousView, setPreviousView] = useState<View | null>(null);

  const navigateTo = (newView: View) => {
    setPreviousView(view);
    setView(newView);
  };

  const goBack = () => {
    if (view === 'emulator' && session.isPlaying) {
      session.setIsPlaying(false);
    }
    if (previousView) {
      setView(previousView);
      setPreviousView(null);
    } else {
      setView('dashboard');
    }
  };

  const navItems = [
    { id: 'dashboard' as View, label: 'Home', icon: Play },
    { id: 'library' as View, label: 'Game Library', icon: FolderOpen },
    { id: 'controller' as View, label: 'Controller', icon: Smartphone },
  ];

  return (
    <div className="h-full w-full bg-[#0a0a1a] flex flex-col overflow-hidden font-sans relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,112,209,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Top Bar */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 shrink-0">
        <div className="flex items-center gap-4">
          {view !== 'dashboard' && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5"
            >
              <ArrowLeft className="w-4 h-4 text-white/70" />
            </motion.button>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0070d1] flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide text-white/90">
              {view === 'dashboard' ? 'SUN EMU' : 
               view === 'library' ? 'Game Library' :
               view === 'controller' ? 'Controller' : 'Now Playing'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30 font-medium">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <User className="w-4 h-4 text-white/50" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 relative z-10 min-h-0">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Hero Banner */}
              <div className="px-8 md:px-16 pt-6 pb-8">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0070d1]/20 via-[#0a0a1a] to-[#0a0a1a] border border-white/5 p-8 md:p-12 min-h-[280px] flex flex-col justify-end">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(0,112,209,0.2)_0%,transparent_70%)] pointer-events-none" />
                  <div className="absolute top-6 right-8 text-8xl opacity-20 pointer-events-none">🎮</div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0070d1] shadow-[0_0_8px_rgba(0,112,209,0.8)]" />
                      <span className="text-[10px] font-bold text-[#0070d1] tracking-[0.25em] uppercase">Ready to Play</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
                      Sun Emulator
                    </h2>
                    <p className="text-white/40 text-sm max-w-md mb-6 leading-relaxed">
                      Load a ROM from your device and start playing retro games instantly. Supports NES, SNES, GBA, PSX, Genesis and more.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigateTo('library')}
                        className="bg-[#0070d1] hover:bg-[#0090ff] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,112,209,0.25)] hover:shadow-[0_0_40px_rgba(0,112,209,0.4)] active:scale-95"
                      >
                        <FolderOpen className="w-4 h-4" />
                        Open Game Library
                      </button>
                      <button
                        onClick={() => navigateTo('controller')}
                        className="text-white/50 hover:text-white px-5 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 border border-white/10 hover:border-white/20 hover:bg-white/5"
                      >
                        <Smartphone className="w-4 h-4" />
                        Connect Controller
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="px-8 md:px-16 pb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">Quick Actions</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="flex gap-3">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className="ps5-card-hover flex items-center gap-3 bg-[#1a1a2e]/60 hover:bg-[#1a1a2e] border border-white/5 rounded-2xl px-5 py-4 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#0070d1]/10 group-hover:bg-[#0070d1]/20 flex items-center justify-center transition-colors">
                        <item.icon className="w-5 h-5 text-[#0070d1]" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white/90">{item.label}</div>
                        <div className="text-[10px] text-white/30 font-medium">
                          {item.id === 'dashboard' ? 'Overview' : 
                           item.id === 'library' ? 'Browse ROMs' : 'Pair Device'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              <FileExplorerApp
                {...session}
                onBack={() => setView('dashboard')}
                onStartGame={() => navigateTo('emulator')}
              />
            </motion.div>
          )}

          {view === 'controller' && (
            <motion.div
              key="controller"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              <ControllerApp {...session} />
            </motion.div>
          )}

          {view === 'emulator' && (
            <motion.div
              key="emulator"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <EmulatorView
                isPlaying={session.isPlaying}
                iframeRef={session.iframeRef}
                romKey={session.romKey}
                sendStartEmulator={session.sendStartEmulator}
                gameName={session.gameName}
                onBack={goBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation (PS5 style) */}
      {view !== 'emulator' && (
        <nav className="relative z-50 shrink-0 px-8 md:px-16 pb-5 pt-2">
          <div className="flex items-center gap-1 bg-[#12122a]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-1.5 max-w-md">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  view === item.id
                    ? 'bg-[#0070d1] text-white shadow-[0_0_20px_rgba(0,112,209,0.3)]'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
