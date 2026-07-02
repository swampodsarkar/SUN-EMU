import React, { useEffect, useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { io, Socket } from "socket.io-client";
import { Upload, MonitorPlay, Gamepad2, Users, Smartphone, Zap } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import type { SupportedCore, EmulatorInputEvent } from "../types";

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

export default function EmulatorView() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [pairCode, setPairCode] = useState<string>("");
  const [controllers, setControllers] = useState<any[]>([]);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [core, setCore] = useState<SupportedCore | null>(null);
  const [gameName, setGameName] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to the socket server
    const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin;
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("host-create-session");
    });

    newSocket.on("session-created", ({ pairCode }) => {
      setPairCode(pairCode);
    });

    newSocket.on("controller-connected", ({ id, playerSlot }) => {
      setControllers((prev) => [...prev, { id, playerSlot }]);
    });

    newSocket.on("controller-disconnected", ({ id }) => {
      setControllers((prev) => prev.filter((c) => c.id !== id));
    });

    newSocket.on("emulator-input", ({ id, type, key, value }: EmulatorInputEvent) => {
      // Find player slot if we want to support multiplayer mapped keys
      // For now, mapping P1
      simulateKey(key, type);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const simulateKey = (key: string, type: "keydown" | "keyup") => {
    let keyCode = 0;
    switch (key) {
      case "ArrowUp": keyCode = 38; break;
      case "ArrowDown": keyCode = 40; break;
      case "ArrowLeft": keyCode = 37; break;
      case "ArrowRight": keyCode = 39; break;
      case "Enter": keyCode = 13; break; // Start
      case "Shift": keyCode = 16; break; // Select
      case "x": keyCode = 88; break; // A
      case "z": keyCode = 90; break; // B
      case "s": keyCode = 83; break; // X
      case "a": keyCode = 65; break; // Y
      case "q": keyCode = 81; break; // L1
      case "w": keyCode = 87; break; // R1
    }

    const event = new KeyboardEvent(type, {
      key: key,
      code: key === 'Enter' ? 'Enter' : key === 'Shift' ? 'ShiftLeft' : key.includes('Arrow') ? key : 'Key' + key.toUpperCase(),
      keyCode: keyCode,
      which: keyCode,
      bubbles: true,
      cancelable: true
    });
    
    document.dispatchEvent(event);
    
    const canvas = document.querySelector('#game canvas');
    if (canvas) {
      canvas.dispatchEvent(event);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const detectedCore = coreExtensions[ext];

    if (!detectedCore) {
      alert("Unsupported file format or core not detected automatically. You may need to select manually.");
      // In a real app we'd let the user choose the core manually.
      return;
    }

    const url = URL.createObjectURL(file);
    setGameUrl(url);
    setCore(detectedCore);
    setGameName(file.name);
  };

  const startGame = () => {
    if (!gameUrl || !core) return;
    setIsPlaying(true);
  };

  // Inject EmulatorJS
  useEffect(() => {
    if (isPlaying && gameUrl && core) {
      (window as any).EJS_player = "#game";
      (window as any).EJS_core = core;
      (window as any).EJS_gameUrl = gameUrl;
      (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
      
      // Optional settings
      (window as any).EJS_color = "#4f46e5"; // Indigo 600
      (window as any).EJS_startOnLoaded = true;

      const script = document.createElement("script");
      script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup EmulatorJS if possible, or just force reload on exit
        // Realistically, EmulatorJS doesn't clean up well, so a page reload might be needed to switch games
      };
    }
  }, [isPlaying, gameUrl, core]);

  const controllerUrl = `${window.location.origin}/controller/${pairCode}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 relative overflow-hidden font-sans">
      {/* Background glowing effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-slate-900/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
            <Gamepad2 className="text-indigo-400 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-display font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
            Sun Emulator
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{controllers.length} Connected</span>
          </div>
          {pairCode && (
            <div className="flex items-center gap-3 text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full">
              <span className="opacity-60 text-xs uppercase tracking-widest font-semibold">Pair Code</span>
              <span className="font-mono text-lg tracking-[0.2em] font-bold text-white">{pairCode}</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 z-10">
        {!isPlaying ? (
          <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-stretch">
            
            {/* Library / Upload Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
                <Upload className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4 text-white">Load Game</h2>
              <p className="text-slate-400 mb-10 max-w-sm leading-relaxed">
                Select a ROM file from your device to begin playing. Supported formats: <span className="text-slate-300">.nes, .smc, .gb, .gba, .iso</span> and more.
              </p>
              
              <div className="relative overflow-hidden w-full max-w-[280px]">
                <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                  <MonitorPlay className="w-5 h-5" />
                  Select ROM
                </button>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".nes,.smc,.sfc,.gb,.gbc,.gba,.nds,.md,.gen,.sms,.gg,.iso,.bin,.a26,.zip"
                />
              </div>

              {gameName && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-5 bg-slate-950/50 rounded-2xl border border-slate-800/80 w-full backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                  <div className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Ready to Play</div>
                  <div className="font-medium text-white truncate text-lg">{gameName}</div>
                  <div className="text-xs text-indigo-400 mt-2 font-mono uppercase tracking-widest bg-indigo-500/10 inline-block px-2 py-1 rounded">Core: {core}</div>
                  
                  <button 
                    onClick={startGame}
                    className="mt-5 w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Start Emulator
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Controller Connection Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden"
            >
              <h2 className="text-3xl font-display font-bold mb-3 text-white">Connect Controller</h2>
              <p className="text-slate-400 mb-10 text-sm max-w-sm leading-relaxed">
                Scan this QR code with your phone to use it as a wireless controller. Both devices must be on the same network.
              </p>
              
              <div className="bg-white p-5 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-8 ring-8 ring-white/5">
                {pairCode ? (
                  <QRCodeSVG 
                    value={controllerUrl} 
                    size={220}
                    level="H"
                    includeMargin={false}
                    fgColor="#0f172a"
                  />
                ) : (
                  <div className="w-[220px] h-[220px] bg-slate-200 animate-pulse rounded-xl flex items-center justify-center text-slate-400 font-medium">
                    Generating...
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-3 w-full">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Or enter code manually</span>
                <div className="flex items-center gap-4 bg-slate-950/80 px-6 py-3 rounded-2xl border border-white/5 w-full justify-between">
                  <span className="text-slate-400 text-sm truncate">{window.location.origin}/controller</span>
                  <div className="w-px h-8 bg-white/10"></div>
                  <span className="font-mono font-bold text-2xl text-indigo-400 tracking-[0.2em]">{pairCode}</span>
                </div>
              </div>
            </motion.div>

          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[1400px] flex flex-col items-center"
          >
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
              {/* EmulatorJS attaches here */}
              <div id="game" className="w-full h-full" ref={gameContainerRef}></div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-6 items-center justify-center bg-slate-900/60 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-semibold tracking-wide text-slate-300">{controllers.length} Mobile Controllers</span>
              </div>
              <div className="w-px h-6 bg-white/10"></div>
              <button 
                onClick={() => window.location.reload()}
                className="text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-xl transition-all text-slate-300 hover:text-white"
              >
                Quit Game
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
