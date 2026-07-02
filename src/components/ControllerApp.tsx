import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, Users } from 'lucide-react';

export default function ControllerApp({ pairCode, controllers }: any) {
  const controllerUrl = `${window.location.origin}/controller/${pairCode}`;

  return (
    <div className="h-full w-full bg-[#020617] text-white p-8 overflow-auto font-sans flex flex-col items-center justify-center">
      <h2 className="text-3xl font-display font-bold mb-3 text-white">Connect Controller</h2>
      <p className="text-slate-400 mb-10 text-sm max-w-sm leading-relaxed text-center">
        Scan this QR code with your phone to use it as a wireless controller. Both devices must be on the same network.
      </p>
      
      <div className="bg-white p-4 rounded-2xl shadow-inner mb-8 ring-8 ring-white/5 relative group">
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl group-hover:blur-2xl transition-all -z-10" />
        <QRCodeSVG value={controllerUrl} size={200} level="H" includeMargin={false} fgColor="#0f172a" />
      </div>

      <div className="flex items-center gap-3 bg-slate-950/50 px-6 py-4 rounded-xl border border-slate-800/80 w-full max-w-[300px] mb-4">
        <Smartphone className="w-6 h-6 text-indigo-400" />
        <div className="flex flex-col items-start flex-1">
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Pair Code</span>
          <span className="text-2xl font-mono font-bold tracking-widest text-indigo-300">{pairCode}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-xl w-full max-w-[300px] justify-center">
        <Users className="w-5 h-5" />
        <span className="font-semibold">{controllers.length} Connected</span>
      </div>
    </div>
  );
}
