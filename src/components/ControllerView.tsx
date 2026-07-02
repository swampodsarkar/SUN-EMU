import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Smartphone, Gamepad2, Wifi, Zap } from "lucide-react";
import { ref, get, set, update, onDisconnect, onValue } from "firebase/database";
import { db } from "../lib/firebase";
import { cn } from "../lib/utils";

export default function ControllerView() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [pairCode, setPairCode] = useState<string>(code || "");
  const [connected, setConnected] = useState(false);
  const [playerSlot, setPlayerSlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const myIdRef = useRef<string>(Math.random().toString(36).substring(2, 9));
  const inputsRef = useRef<Record<string, boolean>>({});

  // Prevent zooming and scrolling on mobile
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.userSelect = "none";
    
    // Prevent context menu
    const blockContext = (e: Event) => e.preventDefault();
    window.addEventListener("contextmenu", blockContext);
    
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.userSelect = "";
      window.removeEventListener("contextmenu", blockContext);
    };
  }, []);

  useEffect(() => {
    // Attempt auto-connect if code exists
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
        
        // Disconnect logic
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

        // Listen for host disconnect
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
    
    if (type === "keydown" && navigator.vibrate) {
      navigator.vibrate(15);
    }

    const isPressed = type === "keydown";
    if (inputsRef.current[key] === isPressed) return; // Prevent duplicate updates
    
    inputsRef.current[key] = isPressed;

    // Send state to Firebase
    update(ref(db, `sessions/${pairCode}/controllers/${myIdRef.current}/inputs`), {
      [key]: isPressed ? true : null // Remove key if not pressed to save space, or false.
    });
  }, [connected, pairCode]);

  // Button Component
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
        onPointerDown={(e) => { e.preventDefault(); emitKey(keyName, "keydown"); }}
        onPointerUp={(e) => { e.preventDefault(); emitKey(keyName, "keyup"); }}
        onPointerLeave={(e) => { e.preventDefault(); emitKey(keyName, "keyup"); }}
        className={cn(
          "relative overflow-hidden bg-gradient-to-b from-slate-700 to-slate-800 border-b-[6px] border-slate-950 active:border-b-0 active:translate-y-[6px] shadow-[0_8px_16px_rgba(0,0,0,0.5)] active:shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center font-bold select-none text-slate-300 active:text-white touch-manipulation transition-all duration-75",
          shape === "round" ? "rounded-full w-16 h-16 md:w-20 md:h-20" : "rounded-2xl px-4 py-2 text-sm",
          className
        )}
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 active:opacity-100 transition-opacity" />
        {label}
      </button>
    );
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[2rem] w-full max-w-sm text-center relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.4)]">
          <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-indigo-500/30">
            <Smartphone className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Controller</h1>
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
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-2xl py-5 font-bold text-lg transition-all active:scale-[0.98] shadow-lg hover:shadow-indigo-500/25"
            >
              Connect
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Force Landscape visually if we can't lock orientation via API
  return (
    <div className="fixed inset-0 bg-[#020617] text-white overflow-hidden flex flex-col font-sans">
      {/* Portrait Warning */}
      <div className="landscape:hidden flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-950 z-50">
        <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <Smartphone className="w-12 h-12 text-indigo-500 animate-pulse rotate-90" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-3 text-white">Rotate Device</h2>
        <p className="text-slate-400 leading-relaxed max-w-xs">The wireless controller requires landscape orientation for the best gameplay experience.</p>
      </div>

      {/* Main Controller UI (Landscape Only) */}
      <div className="hidden landscape:flex flex-col flex-1 w-full h-full justify-between relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />
        
        {/* Top Bar */}
        <div className="h-12 flex items-center justify-between px-8 bg-slate-900/40 backdrop-blur-md border-b border-white/5 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Gamepad2 className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-sm font-bold text-indigo-400 tracking-wider">PLAYER {playerSlot}</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-950/50 px-4 py-1.5 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            <span className="text-xs text-slate-300 font-mono font-bold tracking-widest">{pairCode}</span>
          </div>
        </div>

        {/* Main Controller Area */}
        <div className="flex-1 flex items-center justify-between px-6 sm:px-16 py-4 relative z-10">
          
          {/* L/R Bumpers */}
          <div className="absolute top-4 left-6 sm:left-16">
            <GameButton keyName="q" label="L1" shape="pill" className="w-28 h-12 bg-slate-800/80 text-xs tracking-widest text-slate-400" />
          </div>
          <div className="absolute top-4 right-6 sm:right-16">
            <GameButton keyName="w" label="R1" shape="pill" className="w-28 h-12 bg-slate-800/80 text-xs tracking-widest text-slate-400" />
          </div>

          {/* D-PAD */}
          <div className="relative w-40 h-40 md:w-52 md:h-52 mt-8 drop-shadow-2xl">
            <div className="absolute inset-0 bg-slate-900/60 rounded-full blur-2xl pointer-events-none" />
            {/* Up */}
            <button 
              onPointerDown={(e) => { e.preventDefault(); emitKey("ArrowUp", "keydown"); }}
              onPointerUp={(e) => { e.preventDefault(); emitKey("ArrowUp", "keyup"); }}
              onPointerLeave={(e) => { e.preventDefault(); emitKey("ArrowUp", "keyup"); }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-14 md:w-16 md:h-20 bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-xl active:from-slate-600 active:to-slate-700 border-t-4 border-l-4 border-r-4 border-slate-600/50 shadow-lg touch-manipulation z-10"
            />
            {/* Down */}
            <button 
               onPointerDown={(e) => { e.preventDefault(); emitKey("ArrowDown", "keydown"); }}
               onPointerUp={(e) => { e.preventDefault(); emitKey("ArrowDown", "keyup"); }}
               onPointerLeave={(e) => { e.preventDefault(); emitKey("ArrowDown", "keyup"); }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-14 md:w-16 md:h-20 bg-gradient-to-t from-slate-700 to-slate-800 rounded-b-xl active:from-slate-600 active:to-slate-700 border-b-4 border-l-4 border-r-4 border-slate-600/50 shadow-lg touch-manipulation z-10"
            />
            {/* Left */}
            <button 
              onPointerDown={(e) => { e.preventDefault(); emitKey("ArrowLeft", "keydown"); }}
              onPointerUp={(e) => { e.preventDefault(); emitKey("ArrowLeft", "keyup"); }}
              onPointerLeave={(e) => { e.preventDefault(); emitKey("ArrowLeft", "keyup"); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-12 md:w-20 md:h-16 bg-gradient-to-l from-slate-700 to-slate-800 rounded-l-xl active:from-slate-600 active:to-slate-700 border-l-4 border-t-4 border-b-4 border-slate-600/50 shadow-lg touch-manipulation z-10"
            />
            {/* Right */}
            <button 
              onPointerDown={(e) => { e.preventDefault(); emitKey("ArrowRight", "keydown"); }}
              onPointerUp={(e) => { e.preventDefault(); emitKey("ArrowRight", "keyup"); }}
              onPointerLeave={(e) => { e.preventDefault(); emitKey("ArrowRight", "keyup"); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-12 md:w-20 md:h-16 bg-gradient-to-r from-slate-700 to-slate-800 rounded-r-xl active:from-slate-600 active:to-slate-700 border-r-4 border-t-4 border-b-4 border-slate-600/50 shadow-lg touch-manipulation z-10"
            />
            {/* Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-slate-800 pointer-events-none z-20 rounded-sm shadow-inner" />
          </div>

          {/* Center Buttons (Select / Start) */}
          <div className="flex flex-col gap-8 mt-16 px-4">
            <GameButton keyName="Shift" label="SELECT" shape="pill" className="w-20 h-8 text-[10px] tracking-[0.2em] text-slate-400 bg-slate-800/80" />
            <GameButton keyName="Enter" label="START" shape="pill" className="w-20 h-8 text-[10px] tracking-[0.2em] text-slate-400 bg-slate-800/80" />
          </div>

          {/* Action Buttons */}
          <div className="relative w-44 h-44 md:w-56 md:h-56 mt-8">
             <div className="absolute inset-0 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
             {/* X (Top) */}
             <GameButton keyName="s" label="X" className="absolute top-0 left-1/2 -translate-x-1/2 from-blue-900 to-blue-950 text-blue-400 border-b-blue-950 active:from-blue-800" />
             {/* B (Bottom) */}
             <GameButton keyName="z" label="B" className="absolute bottom-0 left-1/2 -translate-x-1/2 from-yellow-900 to-yellow-950 text-yellow-400 border-b-yellow-950 active:from-yellow-800" />
             {/* Y (Left) */}
             <GameButton keyName="a" label="Y" className="absolute left-0 top-1/2 -translate-y-1/2 from-emerald-900 to-emerald-950 text-emerald-400 border-b-emerald-950 active:from-emerald-800" />
             {/* A (Right) */}
             <GameButton keyName="x" label="A" className="absolute right-0 top-1/2 -translate-y-1/2 from-rose-900 to-rose-950 text-rose-400 border-b-rose-950 active:from-rose-800" />
          </div>

        </div>
        
        {/* Safe Area Padding */}
        <div className="h-6 w-full shrink-0"></div>
      </div>
    </div>
  );
}
