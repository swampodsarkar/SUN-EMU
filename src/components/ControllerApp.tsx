import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, Gamepad, Wifi, CheckCircle2 } from 'lucide-react';
import type { ControllerState } from '../types';

export default function ControllerApp({ 
  pairCode, 
  controllers 
}: { 
  pairCode: string;
  controllers: Record<string, ControllerState>;
}) {
  const [url, setUrl] = useState('');
  
  useEffect(() => {
    setUrl(`${window.location.origin}/controller/${pairCode}`);
  }, [pairCode]);

  const controllerList = Array.isArray(controllers)
    ? controllers
    : Object.entries(controllers || {}).map(([id, val]: any) => ({
        id,
        playerSlot: val.slot || val.playerSlot || 1,
      }));

  return (
    <div className="h-full w-full flex flex-col p-8 md:p-12 text-white font-sans relative overflow-hidden bg-transparent">
      {/* Background accents */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="mb-8 relative z-10 flex flex-col items-center flex-shrink-0">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 drop-shadow-md">Accessories</h1>
        <p className="text-white/60 text-lg md:text-xl font-light max-w-2xl text-center">Scan the QR Code with your mobile device to use it as a wireless remote controller for this system.</p>
      </div>
      
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-10 relative z-10">
        <div className="flex-1 min-h-0 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 flex flex-col items-center justify-center text-center shadow-2xl">
          <div className="bg-white p-5 md:p-6 rounded-[1.5rem] mb-6 shadow-[0_0_60px_rgba(255,255,255,0.15)] ring-1 ring-white/20 transition-transform hover:scale-105 duration-500 flex items-center justify-center aspect-square max-h-[50%]">
            <QRCodeSVG value={url} style={{ width: '100%', height: '100%', maxWidth: '220px', maxHeight: '220px' }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-mono font-medium tracking-widest mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent drop-shadow-sm flex-shrink-0">
            {pairCode}
          </h2>
          <p className="text-white/50 text-sm md:text-base flex-shrink-0">Visit this link directly if unable to scan:<br/><span className="text-white/90 font-medium tracking-wide mt-2 block text-sm md:text-lg overflow-hidden text-ellipsis whitespace-nowrap px-4">{url}</span></p>
        </div>
        
        <div className="flex-1 min-h-0 flex flex-col gap-6 py-2">
          <h3 className="text-xl md:text-2xl font-medium flex items-center gap-4 border-b border-white/10 pb-4 md:pb-6 text-white/90 flex-shrink-0">
            <Gamepad className="w-7 h-7 text-white/70" />
            Connected Devices ({controllerList.length})
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-4 space-y-4">
            {controllerList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-6">
                <div className="relative">
                  <Wifi className="w-16 h-16 relative z-10" />
                  <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full animate-pulse" />
                </div>
                <p className="font-light tracking-wide text-lg md:text-xl text-white/40">Waiting for connection...</p>
              </div>
            ) : (
              controllerList.map((item) => (
                <div key={item.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-[1.5rem] flex items-center justify-between hover:bg-white/10 transition-colors shadow-lg">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                      <Smartphone className="w-7 h-7 md:w-8 md:h-8 text-white/80" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-lg md:text-xl tracking-wide truncate">
                        Player {item.playerSlot} ({item.id.slice(0, 4).toUpperCase()})
                      </div>
                      <div className="text-sm md:text-base text-green-400 flex items-center gap-2 mt-1 md:mt-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 shrink-0" /> Connected
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
