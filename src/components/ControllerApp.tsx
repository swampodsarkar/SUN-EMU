import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, Users, Gamepad2, Wifi } from 'lucide-react';

export default function ControllerApp({ pairCode, controllers }: any) {
  const controllerUrl = `${window.location.origin}/controller/${pairCode}`;

  return (
    <div className="h-full w-full bg-[#050510] flex items-center justify-center overflow-auto">
      <div className="w-full max-w-sm px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#0072ce]/15 to-[#0072ce]/5 border border-[#0072ce]/15 flex items-center justify-center mx-auto mb-6">
            <Gamepad2 className="w-9 h-9 text-[#0072ce]" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">Wireless Controller</h1>
          <p className="text-xs text-white/25 leading-relaxed max-w-xs mx-auto">
            Scan with your phone to pair. Both devices must be on the same network.
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-5 rounded-3xl shadow-[0_0_60px_rgba(0,114,206,0.1)]">
            <QRCodeSVG value={controllerUrl} size={190} level="H" includeMargin={false} fgColor="#050510" />
          </div>
        </div>

        {/* Pair Code */}
        <div className="bg-[#111128]/60 border border-white/5 rounded-2xl p-5 mb-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#0072ce]/8 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-[#0072ce]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase mb-1">Pair Code</div>
              <div className="text-2xl font-mono font-extrabold tracking-[0.3em] text-white">{pairCode}</div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-[#111128]/40 border border-white/5 rounded-2xl p-4 flex items-center justify-center gap-3">
          <div className={`w-2 h-2 rounded-full ${controllers.length > 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`} />
          <span className="text-sm font-medium text-white/40">
            {controllers.length === 0 ? 'Waiting for connection...' : `${controllers.length} controller${controllers.length > 1 ? 's' : ''} connected`}
          </span>
        </div>
      </div>
    </div>
  );
}
