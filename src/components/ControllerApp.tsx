import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, Users, Gamepad2 } from 'lucide-react';

export default function ControllerApp({ pairCode, controllers }: any) {
  const controllerUrl = `${window.location.origin}/controller/${pairCode}`;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#0070d1]/10 border border-[#0070d1]/20 flex items-center justify-center mx-auto mb-5">
            <Gamepad2 className="w-8 h-8 text-[#0070d1]" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight mb-2">Connect Controller</h2>
          <p className="text-xs text-white/30 leading-relaxed">
            Scan the QR code with your phone to use it as a wireless controller.
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-[0_0_40px_rgba(0,112,209,0.15)]">
            <QRCodeSVG value={controllerUrl} size={180} level="H" includeMargin={false} fgColor="#0a0a1a" />
          </div>
        </div>

        {/* Pair Code */}
        <div className="bg-[#1a1a2e]/60 border border-white/5 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0070d1]/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-[#0070d1]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase mb-1">Pair Code</div>
              <div className="text-2xl font-mono font-extrabold tracking-[0.3em] text-white">{pairCode}</div>
            </div>
          </div>
        </div>

        {/* Connected Controllers */}
        <div className="bg-[#1a1a2e]/40 border border-white/5 rounded-2xl p-4 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-white/30" />
            <span className="text-sm font-semibold text-white/50">
              {controllers.length === 0 ? 'No controllers' : `${controllers.length} Connected`}
            </span>
          </div>
          {controllers.length > 0 && (
            <div className="flex items-center gap-1">
              {controllers.map((_: any, i: number) => (
                <div key={i} className="w-6 h-6 rounded-full bg-[#0070d1]/20 flex items-center justify-center text-[10px] font-bold text-[#0070d1] border border-[#0070d1]/30">
                  P{i + 1}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
