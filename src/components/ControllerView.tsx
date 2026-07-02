import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Smartphone, 
  Gamepad2, 
  Wifi, 
  Zap, 
  Volume2, 
  VolumeX, 
  Save, 
  Download, 
  RotateCcw, 
  Monitor, 
  Camera, 
  Settings, 
  Sliders, 
  ChevronLeft, 
  RefreshCw, 
  Eye, 
  Sparkles,
  SlidersHorizontal,
  X,
  Play,
  Pause,
  Home,
  LogOut
} from "lucide-react";
import { ref, get, set, update, onDisconnect, onValue } from "firebase/database";
import { db } from "../lib/firebase";
import { cn } from "../lib/utils";

// Theme Palette Configuration
const THEMES = {
  playstation: {
    name: "PlayStation Slate",
    bg: "bg-radial from-slate-900 via-slate-950 to-[#030712]",
    card: "bg-slate-900/40 border-white/5 text-white backdrop-blur-md",
    dpad: "bg-gradient-to-b from-slate-700 to-slate-800",
    primary: "text-indigo-400 border-indigo-500",
    buttonA: { label: "✕", labelClass: "text-indigo-400 font-sans text-xl font-extrabold", btnClass: "from-slate-800 to-slate-900 border-indigo-950 active:from-indigo-950" },
    buttonB: { label: "◯", labelClass: "text-rose-400 font-sans text-xl font-extrabold", btnClass: "from-slate-800 to-slate-900 border-rose-950 active:from-rose-950" },
    buttonX: { label: "☐", labelClass: "text-pink-400 font-sans text-xl font-extrabold", btnClass: "from-slate-800 to-slate-900 border-pink-950 active:from-pink-950" },
    buttonY: { label: "△", labelClass: "text-emerald-400 font-sans text-xl font-extrabold", btnClass: "from-slate-800 to-slate-900 border-emerald-950 active:from-emerald-950" },
    accent: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30",
    btnColor: "bg-slate-800/80 hover:bg-slate-700/80 text-indigo-400 border-slate-950"
  },
  nintendo: {
    name: "Nintendo Retro",
    bg: "bg-radial from-[#454d59] via-[#2f3542] to-[#1e222b]",
    card: "bg-[#2f3542]/60 border-white/10 text-slate-100 backdrop-blur-md",
    dpad: "bg-gradient-to-b from-neutral-800 to-neutral-900",
    primary: "text-red-500 border-red-950",
    buttonA: { label: "A", labelClass: "text-white font-mono text-xl font-bold", btnClass: "from-red-700 to-red-800 border-red-950 active:from-red-900" },
    buttonB: { label: "B", labelClass: "text-white font-mono text-xl font-bold", btnClass: "from-red-700 to-red-800 border-red-950 active:from-red-900" },
    buttonX: { label: "X", labelClass: "text-[#34495e] font-mono text-xl font-bold", btnClass: "from-neutral-300 to-neutral-400 border-neutral-500 active:from-neutral-400" },
    buttonY: { label: "Y", labelClass: "text-[#34495e] font-mono text-xl font-bold", btnClass: "from-neutral-300 to-neutral-400 border-neutral-500 active:from-neutral-400" },
    accent: "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30",
    btnColor: "bg-neutral-800 hover:bg-neutral-700 text-red-500 border-neutral-950"
  },
  xbox: {
    name: "Xbox Carbon",
    bg: "bg-radial from-neutral-900 via-neutral-950 to-[#020202]",
    card: "bg-neutral-900/60 border-neutral-800 text-white backdrop-blur-md",
    dpad: "bg-gradient-to-b from-zinc-700 to-zinc-800",
    primary: "text-emerald-500 border-emerald-950",
    buttonA: { label: "A", labelClass: "text-emerald-400 font-sans text-xl font-bold", btnClass: "from-slate-900 to-zinc-900 border-emerald-950 active:from-emerald-950" },
    buttonB: { label: "B", labelClass: "text-rose-400 font-sans text-xl font-bold", btnClass: "from-slate-900 to-zinc-900 border-rose-950 active:from-rose-950" },
    buttonX: { label: "X", labelClass: "text-sky-400 font-sans text-xl font-bold", btnClass: "from-slate-900 to-zinc-900 border-sky-950 active:from-sky-950" },
    buttonY: { label: "Y", labelClass: "text-amber-400 font-sans text-xl font-bold", btnClass: "from-slate-900 to-zinc-900 border-amber-950 active:from-amber-950" },
    accent: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30",
    btnColor: "bg-zinc-850 hover:bg-zinc-800 text-emerald-400 border-black"
  },
  cyberpunk: {
    name: "Cyberpunk Neon",
    bg: "bg-radial from-[#090129] via-[#05001c] to-[#01000b]",
    card: "bg-purple-950/20 border-cyan-500/20 text-cyan-100 backdrop-blur-md",
    dpad: "bg-gradient-to-b from-fuchsia-900 to-fuchsia-950 border-cyan-500/20",
    primary: "text-pink-400 border-pink-950",
    buttonA: { label: "A", labelClass: "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)] font-extrabold text-xl", btnClass: "from-cyan-950/40 to-purple-950/40 border-cyan-500 active:from-cyan-950" },
    buttonB: { label: "B", labelClass: "text-fuchsia-400 drop-shadow-[0_0_6px_rgba(240,46,170,0.6)] font-extrabold text-xl", btnClass: "from-fuchsia-950/40 to-purple-950/40 border-fuchsia-500 active:from-fuchsia-950" },
    buttonX: { label: "X", labelClass: "text-pink-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)] font-extrabold text-xl", btnClass: "from-pink-950/40 to-purple-950/40 border-pink-500 active:from-pink-950" },
    buttonY: { label: "Y", labelClass: "text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)] font-extrabold text-xl", btnClass: "from-amber-950/40 to-purple-950/40 border-amber-500 active:from-amber-950" },
    accent: "bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/30",
    btnColor: "bg-purple-950/40 hover:bg-purple-900/40 text-pink-400 border-cyan-500/30"
  }
};

export default function ControllerView() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [pairCode, setPairCode] = useState<string>(code || "");
  const [connected, setConnected] = useState(false);
  const [playerSlot, setPlayerSlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Custom Settings States
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [opacity, setOpacity] = useState(0.9);
  const [sensitivity, setSensitivity] = useState(1.0);
  const [deadZone, setDeadZone] = useState(0.15);
  const [activeTheme, setActiveTheme] = useState<keyof typeof THEMES>("playstation");
  const [activeTab, setActiveTab] = useState<"gameplay" | "tools" | "settings">("gameplay");

  const myIdRef = useRef<string>(Math.random().toString(36).substring(2, 9));
  const inputsRef = useRef<Record<string, boolean>>({});
  const turboIntervalsRef = useRef<Record<string, any>>({});
  const lastStickDirsRef = useRef<Record<string, boolean>>({});

  // Prevent zooming and scrolling on mobile completely
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.userSelect = "none";
    
    const blockContext = (e: Event) => e.preventDefault();
    window.addEventListener("contextmenu", blockContext);
    
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.userSelect = "";
      window.removeEventListener("contextmenu", blockContext);
    };
  }, []);

  // Clear intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(turboIntervalsRef.current).forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    if (code && !connected) {
      connectToHost(code);
    }
  }, [code]);

  const connectToHost = async (codeToJoin: string) => {
    if (!codeToJoin) return;
    setError(null);
    
    try {
      const sessionRef = ref(db, `sessions/${codeToJoin}`);
      const snapshot = await get(sessionRef);
      
      if (snapshot.exists()) {
        const sessionData = snapshot.val();
        const currentControllers = sessionData.controllers || {};
        const controllerCount = Object.keys(currentControllers).length;
        
        if (controllerCount >= 4) {
          setError("Room is full (max 4 controllers).");
          return;
        }

        const newSlot = controllerCount + 1;
        const myControllerRef = ref(db, `sessions/${codeToJoin}/controllers/${myIdRef.current}`);
        
        onDisconnect(myControllerRef).remove();

        await set(myControllerRef, {
          slot: newSlot,
          inputs: {}
        });

        setConnected(true);
        setPlayerSlot(newSlot);
        setPairCode(codeToJoin);

        if (!code) {
          navigate(`/controller/${codeToJoin}`, { replace: true });
        }

        onValue(ref(db, `sessions/${codeToJoin}/hostAlive`), (snap) => {
          if (!snap.exists()) {
            setError("Host disconnected.");
            setConnected(false);
            setPlayerSlot(null);
          }
        });
        
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
          if (screen.orientation && (screen.orientation as any).lock) {
            await (screen.orientation as any).lock("landscape");
          }
        } catch (err) {
          console.warn("Fullscreen/Orientation lock failed:", err);
        }

      } else {
        setError("Invalid or expired Pair Code.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to session.");
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    connectToHost(pairCode);
  };

  const emitKey = useCallback((key: string, type: "keydown" | "keyup") => {
    if (!connected) return;
    
    if (type === "keydown" && vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(15);
    }

    const isPressed = type === "keydown";
    if (inputsRef.current[key] === isPressed) return;
    
    inputsRef.current[key] = isPressed;

    update(ref(db, `sessions/${pairCode}/controllers/${myIdRef.current}/inputs`), {
      [key]: isPressed ? true : null
    });
  }, [connected, pairCode, vibrationEnabled]);

  // Momentary tap utility for Hotkeys / Emulator Tools
  const triggerHotkey = (keyName: string) => {
    emitKey(keyName, "keydown");
    setTimeout(() => {
      emitKey(keyName, "keyup");
    }, 80);
  };

  // Turbo Rapid-firing Implementation
  const handleTurboPress = (key: string) => {
    if (turboIntervalsRef.current[key]) return;
    
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(25);
    }

    let isDown = false;
    turboIntervalsRef.current[key] = setInterval(() => {
      isDown = !isDown;
      emitKey(key, isDown ? "keydown" : "keyup");
    }, 60); // Rapid trigger rate (60ms)
  };

  const handleTurboRelease = (key: string) => {
    if (turboIntervalsRef.current[key]) {
      clearInterval(turboIntervalsRef.current[key]);
      delete turboIntervalsRef.current[key];
    }
    emitKey(key, "keyup");
  };

  // Analog Stick Coordinate Mapping to D-Pad (Left Stick) or Action Buttons (Right Stick)
  const handleLeftStickMove = (x: number, y: number) => {
    const threshold = deadZone * sensitivity;
    
    const triggerDir = (key: string, shouldTrigger: boolean) => {
      const isCurrentlyTriggered = lastStickDirsRef.current[key] || false;
      if (shouldTrigger && !isCurrentlyTriggered) {
        lastStickDirsRef.current[key] = true;
        emitKey(key, "keydown");
      } else if (!shouldTrigger && isCurrentlyTriggered) {
        lastStickDirsRef.current[key] = false;
        emitKey(key, "keyup");
      }
    };

    triggerDir("ArrowLeft", x < -threshold);
    triggerDir("ArrowRight", x > threshold);
    triggerDir("ArrowUp", y < -threshold);
    triggerDir("ArrowDown", y > threshold);
  };

  const handleRightStickMove = (x: number, y: number) => {
    const threshold = deadZone * sensitivity;
    
    const triggerDir = (key: string, shouldTrigger: boolean) => {
      const isCurrentlyTriggered = lastStickDirsRef.current[key] || false;
      if (shouldTrigger && !isCurrentlyTriggered) {
        lastStickDirsRef.current[key] = true;
        emitKey(key, "keydown");
      } else if (!shouldTrigger && isCurrentlyTriggered) {
        lastStickDirsRef.current[key] = false;
        emitKey(key, "keyup");
      }
    };

    // Right Stick maps redundantly to Y (left), A (right), X (up), B (down) action inputs
    triggerDir("a", x < -threshold); // Y
    triggerDir("x", x > threshold);  // A
    triggerDir("s", y < -threshold); // X
    triggerDir("z", y > threshold);  // B
  };

  // Individual Analog Stick Sub-component
  const AnalogStick = ({ 
    type, 
    onMove, 
    onClick 
  }: { 
    type: "left" | "right", 
    onMove: (x: number, y: number) => void, 
    onClick: () => void 
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const handleStart = (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e);
    };

    const handleMove = (e: React.PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      updatePosition(e);
    };

    const handleEnd = (e: React.PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setIsDragging(false);
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      setKnobPos({ x: 0, y: 0 });
      onMove(0, 0);
    };

    const updatePosition = (e: React.PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      let dx = e.clientX - centerX;
      let dy = e.clientY - centerY;
      
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxRadius = rect.width / 2 - 22; // strict knob movement bound

      if (distance > maxRadius) {
        dx = (dx / distance) * maxRadius;
        dy = (dy / distance) * maxRadius;
      }

      setKnobPos({ x: dx, y: dy });
      onMove(dx / maxRadius, dy / maxRadius);
    };

    return (
      <div 
        ref={containerRef}
        onPointerDown={handleStart}
        onPointerMove={handleMove}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black/60 border border-white/10 flex items-center justify-center relative touch-none shadow-[inner_0_4px_12px_rgba(0,0,0,0.8)] shrink-0"
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
        <div className="w-0.5 h-6 bg-slate-800/40 absolute top-1" />
        <div className="w-0.5 h-6 bg-slate-800/40 absolute bottom-1" />
        <div className="h-0.5 w-6 bg-slate-800/40 absolute left-1" />
        <div className="h-0.5 w-6 bg-slate-800/40 absolute right-1" />
        <div className="absolute inset-2 border border-slate-800/20 rounded-full pointer-events-none" />

        <div 
          style={{ transform: `translate(${knobPos.x}px, ${knobPos.y}px)` }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-slate-750 to-slate-900 border border-slate-600/80 shadow-[0_6px_15px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none relative transition-transform duration-75"
        >
          <div className="w-8 h-8 rounded-full border border-slate-600/30 bg-slate-950/50 flex items-center justify-center">
            <button 
              onPointerDown={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="w-5 h-5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-90 text-[7px] font-bold text-white/60 flex items-center justify-center pointer-events-auto"
            >
              {type === "left" ? "L3" : "R3"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Reusable GameButton component that adjusts automatically to settings opacity
  const GameButton = ({ 
    keyName, 
    label, 
    className, 
    shape = "round" 
  }: { 
    keyName: string, 
    label: string | React.ReactNode, 
    className?: string,
    shape?: "round" | "pill"
  }) => {
    return (
      <button
        style={{ opacity }}
        onPointerDown={(e) => { e.preventDefault(); emitKey(keyName, "keydown"); }}
        onPointerUp={(e) => { e.preventDefault(); emitKey(keyName, "keyup"); }}
        onPointerLeave={(e) => { e.preventDefault(); emitKey(keyName, "keyup"); }}
        className={cn(
          "relative overflow-hidden bg-gradient-to-b from-slate-700 to-slate-800 border-b-[5px] border-slate-950 active:border-b-0 active:translate-y-[5px] shadow-[0_6px_12px_rgba(0,0,0,0.4)] active:shadow-[0_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center font-bold select-none text-slate-300 active:text-white touch-manipulation transition-all duration-75",
          shape === "round" ? "rounded-full w-14 h-14 sm:w-16 sm:h-16" : "rounded-xl px-4 py-2.5 text-xs",
          className
        )}
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 active:opacity-100 transition-opacity" />
        {label}
      </button>
    );
  };

  const selectedTheme = THEMES[activeTheme];

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] w-full max-w-sm text-center relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-indigo-500/30">
            <Smartphone className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Virtual Controller</h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">Enter the 6-digit pair code shown on the emulator screen to connect.</p>
          
          <form onSubmit={handleJoin} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="000000"
              maxLength={6}
              value={pairCode}
              onChange={(e) => setPairCode(e.target.value.replace(/\D/g, ''))}
              className="bg-slate-950/80 border border-slate-700/80 rounded-2xl px-4 py-5 text-center text-4xl tracking-[0.4em] font-mono font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-inner"
            />
            {error && <div className="text-rose-400 text-sm font-semibold bg-rose-500/10 py-2 rounded-lg">{error}</div>}
            
            <button 
              type="submit"
              disabled={pairCode.length !== 6}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-2xl py-5 font-bold text-lg transition-all active:scale-[0.98] shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
            >
              Connect Controller
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("fixed inset-0 text-white overflow-hidden flex flex-col font-sans transition-all duration-500 select-none touch-none", selectedTheme.bg)}>
      {/* Visual Portrait Warning */}
      <div className="landscape:hidden flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-950 z-50">
        <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <Smartphone className="w-12 h-12 text-indigo-500 animate-pulse rotate-90" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-3 text-white">Rotate Device</h2>
        <p className="text-slate-400 leading-relaxed max-w-xs">The wireless controller requires landscape orientation for the best gameplay experience.</p>
      </div>

      {/* Main Controller UI (Landscape Only) */}
      <div className="hidden landscape:flex flex-col flex-1 w-full h-full justify-between relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none" />
        
        {/* Top bar / Display Panel */}
        <div className="h-12 shrink-0 flex items-center justify-between px-6 bg-slate-950/40 border-b border-white/5 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
              <Gamepad2 className="w-4 h-4 text-white/80" />
            </div>
            <span className="text-xs font-bold tracking-widest text-slate-300 font-mono">
              PLAYER {playerSlot} • <span className="text-indigo-400 font-bold">{selectedTheme.name}</span>
            </span>
          </div>

          {/* Quick tab switcher inside display panel */}
          <div className="flex bg-black/60 p-1 rounded-full border border-white/10 shadow-inner">
            <button 
              onClick={() => setActiveTab("gameplay")}
              className={cn("px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shrink-0 cursor-pointer", activeTab === "gameplay" ? "bg-white/10 text-white shadow-md" : "text-white/40 hover:text-white/70")}
            >
              Controls
            </button>
            <button 
              onClick={() => setActiveTab("tools")}
              className={cn("px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shrink-0 cursor-pointer", activeTab === "tools" ? "bg-white/10 text-white shadow-md" : "text-white/40 hover:text-white/70")}
            >
              Hotkeys
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={cn("px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shrink-0 cursor-pointer", activeTab === "settings" ? "bg-white/10 text-white shadow-md" : "text-white/40 hover:text-white/70")}
            >
              Settings
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>PAIR: <span className="font-bold text-white tracking-widest">{pairCode}</span></span>
            </div>
          </div>
        </div>

        {/* Dynamic Inner Layout Body */}
        <div className="flex-1 w-full relative overflow-hidden flex flex-col justify-center">

          {/* Tab 1: Gameplay Canvas */}
          {activeTab === "gameplay" && (
            <div className="flex-1 w-full flex items-center justify-between px-8 py-3 relative">
              
              {/* Left Side: DPAD + L1/L2 Shoulder Triggers + Left Analog Stick + Turbo Y/X */}
              <div className="flex items-center gap-6 h-full relative">
                
                {/* L1 & L2 Triggers */}
                <div className="absolute -top-3 left-0 flex gap-2.5 z-10">
                  <GameButton keyName="q" label="L1" shape="pill" className="w-18 h-10 text-[10px] tracking-widest" />
                  <GameButton keyName="e" label="L2" shape="pill" className="w-18 h-10 text-[10px] tracking-widest" />
                </div>

                {/* Left Analog Stick */}
                <div className="mt-8 flex flex-col items-center">
                  <AnalogStick type="left" onMove={handleLeftStickMove} onClick={() => triggerHotkey("t")} />
                  <span className="text-[9px] text-white/30 font-mono tracking-widest uppercase mt-1">Left Analog (L3)</span>
                </div>

                {/* Classical Cross D-Pad */}
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 mt-8 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
                  <div className="absolute inset-0 bg-black/40 rounded-full blur-xl pointer-events-none" />
                  
                  {/* Up */}
                  <button 
                    onPointerDown={(e) => { e.preventDefault(); emitKey("ArrowUp", "keydown"); }}
                    onPointerUp={(e) => { e.preventDefault(); emitKey("ArrowUp", "keyup"); }}
                    onPointerLeave={(e) => { e.preventDefault(); emitKey("ArrowUp", "keyup"); }}
                    className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-11 h-13 sm:w-12 sm:h-15 rounded-t-lg active:scale-95 border-t-2 border-l border-r border-white/10 shadow-md touch-manipulation z-10", selectedTheme.dpad)}
                  />
                  {/* Down */}
                  <button 
                    onPointerDown={(e) => { e.preventDefault(); emitKey("ArrowDown", "keydown"); }}
                    onPointerUp={(e) => { e.preventDefault(); emitKey("ArrowDown", "keyup"); }}
                    onPointerLeave={(e) => { e.preventDefault(); emitKey("ArrowDown", "keyup"); }}
                    className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-13 sm:w-12 sm:h-15 rounded-b-lg active:scale-95 border-b-2 border-l border-r border-white/10 shadow-md touch-manipulation z-10", selectedTheme.dpad)}
                  />
                  {/* Left */}
                  <button 
                    onPointerDown={(e) => { e.preventDefault(); emitKey("ArrowLeft", "keydown"); }}
                    onPointerUp={(e) => { e.preventDefault(); emitKey("ArrowLeft", "keyup"); }}
                    onPointerLeave={(e) => { e.preventDefault(); emitKey("ArrowLeft", "keyup"); }}
                    className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-13 h-11 sm:w-15 sm:h-12 rounded-l-lg active:scale-95 border-l-2 border-t border-b border-white/10 shadow-md touch-manipulation z-10", selectedTheme.dpad)}
                  />
                  {/* Right */}
                  <button 
                    onPointerDown={(e) => { e.preventDefault(); emitKey("ArrowRight", "keydown"); }}
                    onPointerUp={(e) => { e.preventDefault(); emitKey("ArrowRight", "keyup"); }}
                    onPointerLeave={(e) => { e.preventDefault(); emitKey("ArrowRight", "keyup"); }}
                    className={cn("absolute right-0 top-1/2 -translate-y-1/2 w-13 h-11 sm:w-15 sm:h-12 rounded-r-lg active:scale-95 border-r-2 border-t border-b border-white/10 shadow-md touch-manipulation z-10", selectedTheme.dpad)}
                  />
                  {/* Center Core */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-slate-900 pointer-events-none z-20 rounded shadow-inner border border-white/5" />
                </div>

                {/* Left side Turbos: Turbo Y and Turbo X */}
                <div className="flex flex-col gap-3 mt-8">
                  <div className="flex flex-col items-center">
                    <button
                      onPointerDown={() => handleTurboPress("a")}
                      onPointerUp={() => handleTurboRelease("a")}
                      onPointerLeave={() => handleTurboRelease("a")}
                      className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-indigo-500/20 active:scale-95 flex items-center justify-center text-indigo-400 font-extrabold text-xs shadow-md"
                    >
                      T_Y
                    </button>
                    <span className="text-[8px] text-white/30 font-bold uppercase mt-1">Turbo Y</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      onPointerDown={() => handleTurboPress("s")}
                      onPointerUp={() => handleTurboRelease("s")}
                      onPointerLeave={() => handleTurboRelease("s")}
                      className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-pink-500/20 active:scale-95 flex items-center justify-center text-pink-400 font-extrabold text-xs shadow-md"
                    >
                      T_X
                    </button>
                    <span className="text-[8px] text-white/30 font-bold uppercase mt-1">Turbo X</span>
                  </div>
                </div>

              </div>

              {/* Middle Section: Select / Start / Home / Pause */}
              <div className="flex flex-col items-center justify-center gap-4 mt-8 px-2">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <GameButton keyName="Shift" label="SELECT" shape="pill" className="w-16 h-8 text-[9px] tracking-widest" />
                    <span className="text-[8px] text-white/30 font-mono uppercase mt-1">Select</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <GameButton keyName="Enter" label="START" shape="pill" className="w-16 h-8 text-[9px] tracking-widest" />
                    <span className="text-[8px] text-white/30 font-mono uppercase mt-1">Start</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <GameButton keyName="Escape" label={<Home className="w-3.5 h-3.5 text-rose-400" />} shape="round" className="w-10 h-10 border-b-4" />
                    <span className="text-[8px] text-rose-400/55 font-mono uppercase mt-1 font-bold">Quit</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <GameButton keyName="p" label={<Pause className="w-3.5 h-3.5 text-indigo-400" />} shape="round" className="w-10 h-10 border-b-4" />
                    <span className="text-[8px] text-indigo-400/55 font-mono uppercase mt-1 font-bold">Pause</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Turbo B/A + Action buttons (X/Y/A/B) + Right Analog Stick + R1/R2 Shoulder Triggers */}
              <div className="flex items-center gap-6 h-full relative">

                {/* Right side Turbos: Turbo B and Turbo A */}
                <div className="flex flex-col gap-3 mt-8">
                  <div className="flex flex-col items-center">
                    <button
                      onPointerDown={() => handleTurboPress("z")}
                      onPointerUp={() => handleTurboRelease("z")}
                      onPointerLeave={() => handleTurboRelease("z")}
                      className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-rose-500/20 active:scale-95 flex items-center justify-center text-rose-400 font-extrabold text-xs shadow-md"
                    >
                      T_B
                    </button>
                    <span className="text-[8px] text-white/30 font-bold uppercase mt-1">Turbo B</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      onPointerDown={() => handleTurboPress("x")}
                      onPointerUp={() => handleTurboRelease("x")}
                      onPointerLeave={() => handleTurboRelease("x")}
                      className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/20 active:scale-95 flex items-center justify-center text-emerald-400 font-extrabold text-xs shadow-md"
                    >
                      T_A
                    </button>
                    <span className="text-[8px] text-white/30 font-bold uppercase mt-1">Turbo A</span>
                  </div>
                </div>

                {/* Action Buttons Pad */}
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 mt-8 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
                  <div className="absolute inset-0 bg-black/40 rounded-full blur-xl pointer-events-none" />
                  
                  {/* Top: X (mpped to 's') */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2">
                    <GameButton keyName="s" label={selectedTheme.buttonX.label} className={cn("w-13 h-13 sm:w-14 sm:h-14 border-b-4", selectedTheme.buttonX.btnClass, selectedTheme.buttonX.labelClass)} />
                  </div>
                  {/* Bottom: B (mapped to 'z') */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                    <GameButton keyName="z" label={selectedTheme.buttonB.label} className={cn("w-13 h-13 sm:w-14 sm:h-14 border-b-4", selectedTheme.buttonB.btnClass, selectedTheme.buttonB.labelClass)} />
                  </div>
                  {/* Left: Y (mapped to 'a') */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2">
                    <GameButton keyName="a" label={selectedTheme.buttonY.label} className={cn("w-13 h-13 sm:w-14 sm:h-14 border-b-4", selectedTheme.buttonY.btnClass, selectedTheme.buttonY.labelClass)} />
                  </div>
                  {/* Right: A (mapped to 'x') */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <GameButton keyName="x" label={selectedTheme.buttonA.label} className={cn("w-13 h-13 sm:w-14 sm:h-14 border-b-4", selectedTheme.buttonA.btnClass, selectedTheme.buttonA.labelClass)} />
                  </div>
                </div>

                {/* Right Analog Stick */}
                <div className="mt-8 flex flex-col items-center">
                  <AnalogStick type="right" onMove={handleRightStickMove} onClick={() => triggerHotkey("y")} />
                  <span className="text-[9px] text-white/30 font-mono tracking-widest uppercase mt-1">Right Analog (R3)</span>
                </div>

                {/* R1 & R2 Triggers */}
                <div className="absolute -top-3 right-0 flex gap-2.5 z-10">
                  <GameButton keyName="w" label="R1" shape="pill" className="w-18 h-10 text-[10px] tracking-widest" />
                  <GameButton keyName="r" label="R2" shape="pill" className="w-18 h-10 text-[10px] tracking-widest" />
                </div>

              </div>

            </div>
          )}

          {/* Tab 2: Hotkeys & Advanced Emulator Tools */}
          {activeTab === "tools" && (
            <div className="flex-1 w-full max-w-4xl mx-auto px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto max-h-[75vh]">
              
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Save className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded-full">F2</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">Quick Save State</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">Saves the current emulation progress instantly.</p>
                </div>
                <button 
                  onClick={() => triggerHotkey("f2")}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Save State
                </button>
              </div>

              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Download className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded-full">F4</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">Quick Load State</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">Loads your last saved state instantly.</p>
                </div>
                <button 
                  onClick={() => triggerHotkey("f4")}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Load State
                </button>
              </div>

              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full">F</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">Fast Forward</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">Speeds up repetitive scenes or loading blocks.</p>
                </div>
                <button 
                  onPointerDown={() => emitKey("f", "keydown")}
                  onPointerUp={() => emitKey("f", "keyup")}
                  onPointerLeave={() => emitKey("f", "keyup")}
                  className="mt-4 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Hold Fast Forward
                </button>
              </div>

              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono font-bold px-2 py-0.5 rounded-full">H</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">Rewind Gameplay</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">Rewinds state to escape lethal in-game traps.</p>
                </div>
                <button 
                  onPointerDown={() => emitKey("h", "keydown")}
                  onPointerUp={() => emitKey("h", "keyup")}
                  onPointerLeave={() => emitKey("h", "keyup")}
                  className="mt-4 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Hold Rewind
                </button>
              </div>

              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-red-500/20 text-red-300 font-mono font-bold px-2 py-0.5 rounded-full">I</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">Hard Reset</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">Reboots the emulator core immediately.</p>
                </div>
                <button 
                  onClick={() => triggerHotkey("i")}
                  className="mt-4 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Reset Core
                </button>
              </div>

              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono font-bold px-2 py-0.5 rounded-full">G</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">Toggle Fullscreen</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">Maximizes the screen frame on the host monitor.</p>
                </div>
                <button 
                  onClick={() => triggerHotkey("g")}
                  className="mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Fullscreen
                </button>
              </div>

              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full">K</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">Take Screenshot</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">Captures gameplay display into local file.</p>
                </div>
                <button 
                  onClick={() => triggerHotkey("k")}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Screenshot
                </button>
              </div>

              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono font-bold px-2 py-0.5 rounded-full">ESC</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">Exit Game Play</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">Exits back to the operating system deck.</p>
                </div>
                <button 
                  onClick={() => triggerHotkey("Escape")}
                  className="mt-4 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Quit Game (ESC)
                </button>
              </div>

              <div className="col-span-2 md:col-span-4 bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-around">
                <button onClick={() => triggerHotkey("m")} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer">
                  <VolumeX className="w-4 h-4 text-rose-400" />
                  <span>Mute Audio (M)</span>
                </button>
                <button onClick={() => triggerHotkey("o")} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer">
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                  <span>Volume + (O)</span>
                </button>
                <button onClick={() => triggerHotkey("u")} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer">
                  <VolumeX className="w-4 h-4 text-indigo-400" />
                  <span>Volume - (U)</span>
                </button>
                <button onClick={() => triggerHotkey("v")} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Speed + (V)</span>
                </button>
                <button onClick={() => triggerHotkey("c")} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer">
                  <Zap className="w-4 h-4 text-slate-400" />
                  <span>Speed - (C)</span>
                </button>
              </div>

            </div>
          )}

          {/* Tab 3: Advanced Controller Settings */}
          {activeTab === "settings" && (
            <div className="flex-1 w-full max-w-4xl mx-auto px-10 py-6 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[75vh]">
              
              {/* Theme Settings Selection */}
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm tracking-wide text-indigo-300 flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4" />
                    Controller Theme Selection
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(THEMES).map(([id, t]) => (
                      <button
                        key={id}
                        onClick={() => {
                          setActiveTheme(id as any);
                          if (vibrationEnabled && navigator.vibrate) navigator.vibrate(30);
                        }}
                        className={cn(
                          "p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer relative overflow-hidden active:scale-95",
                          activeTheme === id 
                            ? "bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10" 
                            : "bg-black/40 border-white/5 hover:border-white/10"
                        )}
                      >
                        <span className="font-bold text-xs text-white">{t.name}</span>
                        <div className="flex gap-1.5 items-center mt-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-black/30 border border-white/5 p-3 rounded-xl mt-5">
                  <span className="text-[10px] text-slate-400 leading-normal block">
                    Selecting a theme changes the button indicators, visual layout style, and accent colors of your wireless touch controller.
                  </span>
                </div>
              </div>

              {/* Slider variables and hardware settings */}
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <h3 className="font-bold text-sm tracking-wide text-indigo-300 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Layout and Analog Calibrations
                  </h3>

                  {/* Button Opacity Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Button Opacity</span>
                      <span className="text-white">{Math.round(opacity * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min={0.1} 
                      max={1.0} 
                      step={0.05} 
                      value={opacity} 
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-2.5 rounded-full cursor-pointer"
                    />
                  </div>

                  {/* Analog sensitivity */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Analog Sensitivity</span>
                      <span className="text-white">{sensitivity.toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range" 
                      min={0.5} 
                      max={2.0} 
                      step={0.1} 
                      value={sensitivity} 
                      onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-2.5 rounded-full cursor-pointer"
                    />
                  </div>

                  {/* Dead Zone */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Analog Dead Zone</span>
                      <span className="text-white">{(deadZone * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min={0.05} 
                      max={0.4} 
                      step={0.05} 
                      value={deadZone} 
                      onChange={(e) => setDeadZone(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-2.5 rounded-full cursor-pointer"
                    />
                  </div>
                </div>

                {/* Vibration/Haptic toggle */}
                <div className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Vibration (Haptics)</span>
                    <span className="text-[10px] text-slate-400">Triggers custom vibrations on button clicks.</span>
                  </div>
                  <button 
                    onClick={() => {
                      setVibrationEnabled(!vibrationEnabled);
                      if (!vibrationEnabled && navigator.vibrate) navigator.vibrate([30, 40, 30]);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                      vibrationEnabled 
                        ? "bg-indigo-600 text-white hover:bg-indigo-500" 
                        : "bg-slate-800 text-slate-400 hover:bg-slate-750"
                    )}
                  >
                    {vibrationEnabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Bottom padding safety spacing */}
        <div className="h-4 w-full shrink-0"></div>
      </div>
    </div>
  );
}
