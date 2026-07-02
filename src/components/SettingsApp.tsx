import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { 
  Gamepad2, Cloud, User, Palette, Moon, Globe, Bell, 
  Shield, HardDrive, Settings2, CloudLightning, Mic, 
  Wifi, Zap, Image as ImageIcon, RefreshCw, DownloadCloud, 
  Trophy, Heart, CreditCard, MessageSquare, Info, ChevronRight, Check,
  Play, Server, Eye, Volume2, Key, HelpCircle, Laptop, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MENU_ITEMS = [
  { id: 'emulator', label: 'Emulator Settings', icon: Settings2, color: 'text-gray-400', desc: 'CRT filters, video aspect ratio, and rewind memory' },
  { id: 'controller', label: 'Controller Settings', icon: Gamepad2, color: 'text-blue-400', desc: 'Control mappings, vibration rumble, and accessories' },
  { id: 'performance', label: 'Performance & Diagnostics', icon: Zap, color: 'text-yellow-400', desc: 'Frame rate cap, low-latency, and diagnostic utility' },
  { id: 'cloud_storage', label: 'Cloud Saves & Storage', icon: Cloud, color: 'text-sky-400', desc: 'Firebase save backup and local cache manager' },
  { id: 'themes', label: 'Themes & Wallpaper', icon: Palette, color: 'text-pink-400', desc: 'Dashboard styling, light/dark, and wallpapers' },
  { id: 'profile', label: 'Gamer Profile & Badges', icon: User, color: 'text-indigo-400', desc: 'User profile, achievements, and games wishlist' },
  { id: 'about', label: 'System Info & Help', icon: Info, color: 'text-emerald-400', desc: 'Languages, system specs, FAQ, and support' },
];

const WALLPAPERS = [
  { id: 'cosmic', label: 'Cosmic Slate', bg: 'from-slate-950 via-zinc-900 to-indigo-950' },
  { id: 'neon', label: 'Neon Vapor', bg: 'from-purple-950 via-fuchsia-950 to-pink-950' },
  { id: 'midnight', label: 'Midnight Blue', bg: 'from-slate-950 via-blue-950 to-emerald-950' },
  { id: 'retro', label: 'Retro Classic', bg: 'from-gray-950 via-slate-900 to-slate-950' },
  { id: 'cyber', label: 'Cyber City', bg: 'from-black via-slate-950 to-rose-950' },
  { id: 'forest', label: 'Forest Peak', bg: 'from-zinc-950 via-emerald-950 to-stone-950' },
];

export default function SettingsApp() {
  const [activeTab, setActiveTab] = useState('emulator');
  const { settings, updateSettings, currentUser, wishlist, toggleWishlist, achievements, games } = useStore();

  // Simulated system/test states
  const [rumbleTest, setRumbleTest] = useState(false);
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [latencyTesting, setLatencyTesting] = useState(false);
  const [latencyResult, setLatencyResult] = useState<{ ping: number; jitter: number; speed: number } | null>(null);
  const [voiceTesting, setVoiceTesting] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState<number[]>([12, 18, 5, 20, 32, 10, 8, 15, 22, 5]);
  const [pinEntry, setPinEntry] = useState('');
  const [securityMessage, setSecurityMessage] = useState('');
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherMessage, setVoucherMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150');
  const [profileName, setProfileName] = useState(currentUser?.email ? currentUser.email.split('@')[0] : 'Guest Gamer');
  const [profileBio, setProfileBio] = useState('Hardcore retro gaming enthusiast.');
  const [remapKey, setRemapKey] = useState<string | null>(null);
  const [keyMappings, setKeyMappings] = useState<Record<string, string>>({
    'D-Pad Up': 'ArrowUp',
    'D-Pad Down': 'ArrowDown',
    'D-Pad Left': 'ArrowLeft',
    'D-Pad Right': 'ArrowRight',
    'Button A': 'X',
    'Button B': 'Z',
    'Button X': 'S',
    'Button Y': 'A',
    'Start': 'Enter',
    'Select': 'Shift',
  });
  const [availableStorage, setAvailableStorage] = useState({ games: 3.0, saves: 1.2, free: 5.8 });

  // Handle active audio level simulation when voice test runs
  useEffect(() => {
    let interval: any;
    if (voiceTesting) {
      interval = setInterval(() => {
        setVoiceVolume(Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 10));
      }, 120);
    } else {
      setVoiceVolume(Array.from({ length: 12 }, () => 5));
    }
    return () => clearInterval(interval);
  }, [voiceTesting]);

  const testRumble = () => {
    if (rumbleTest) return;
    setRumbleTest(true);
    setTimeout(() => setRumbleTest(false), 1500);
  };

  const forceCloudSync = () => {
    if (cloudSyncing) return;
    setCloudSyncing(true);
    setSyncMessage('Connecting to Firebase database servers...');
    setTimeout(() => {
      setSyncMessage('Uploading local game saves & state blocks...');
      setTimeout(() => {
        setSyncMessage('Cloud Backup Complete! All states synchronized.');
        setCloudSyncing(false);
      }, 1000);
    }, 1200);
  };

  const runLatencyTest = () => {
    if (latencyTesting) return;
    setLatencyTesting(true);
    setLatencyResult(null);
    setTimeout(() => {
      setLatencyResult({
        ping: Math.floor(Math.random() * 15) + 8,
        jitter: parseFloat((Math.random() * 1.5 + 0.2).toFixed(1)),
        speed: Math.floor(Math.random() * 200) + 120,
      });
      setLatencyTesting(false);
    }, 2000);
  };

  const runDiagnostics = () => {
    if (diagnosticRunning) return;
    setDiagnosticRunning(true);
    setDiagnosticLogs([]);
    const logs = [
      'Initializing hardware diagnostic pipeline...',
      'Checking CPU Core architecture virtualization support... PASS',
      'Verifying WebGL 2.0 Web GPU renderer contexts... PASS',
      'Testing AudioEngine WebAudio latency response... 4.2ms (PASS)',
      'Scanning local storage state consistency... OK',
      'Polling background Gamepad connectivity... Complete',
      'SUN EMULATOR HEALTH STATUS: 100% PERFECT.'
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setDiagnosticLogs(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setDiagnosticRunning(false);
      }
    }, 500);
  };

  const checkUpdates = () => {
    if (checkingUpdate) return;
    setCheckingUpdate(true);
    setUpdateMessage('Polling firmware update distribution servers...');
    setTimeout(() => {
      setUpdateMessage('Checking code package consistency... Status: 1.0.1');
      setTimeout(() => {
        setUpdateMessage('System firmware is fully up-to-date. SunOS v1.0.1 Stable Channel.');
        setCheckingUpdate(false);
      }, 1200);
    }, 1200);
  };

  const handleRemapClick = (btnName: string) => {
    setRemapKey(btnName);
  };

  useEffect(() => {
    if (!remapKey) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeyMappings(prev => ({ ...prev, [remapKey]: e.key }));
      setRemapKey(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [remapKey]);

  const redeemCode = () => {
    if (!voucherCode.trim()) return;
    if (voucherCode.toUpperCase() === 'SUN50') {
      updateSettings({ subscriptionTier: 'Ultimate Retro Gamer' });
      setVoucherMessage('Success! Promoted to Ultimate Retro Gamer tier (Lifetime Access).');
    } else {
      setVoucherMessage('Invalid voucher promo code. Try "SUN50".');
    }
  };

  const clearROMCache = () => {
    setAvailableStorage(prev => ({
      ...prev,
      games: 0.2,
      free: prev.free + (prev.games - 0.2)
    }));
    alert('ROM cached buffers cleared successfully!');
  };

  const faqs = [
    { q: 'How do I link a smartphone as a controller?', a: 'Go to Accessories / Controller pairing on the main desktop. Open the unique paired URL on your mobile browser, enter the 4-character session code, and use your smartphone as a fully responsive handheld controller!' },
    { q: 'Can I upload my own ROM games?', a: 'To ensure system stability and security, direct local ROM uploading is disabled. Please download your games directly from our secure built-in Store catalog on the home screen!' },
    { q: 'Where are my save files stored?', a: 'Save states are automatically packed and safely synchronized both locally inside your browser cache and remotely inside your linked cloud storage.' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'emulator':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Emulator Settings</h2>
              <p className="text-white/50 text-sm mt-1">Configure active emulation shaders, screen ratios, and rewind state buffers</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-medium">Shader Screen Filter</h3>
              <p className="text-white/50 text-sm">Emulate vintage display CRT cathode ray screen technologies</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'none', name: 'None (Raw Pixel)' },
                  { id: 'scanlines', name: 'CRT Scanlines' },
                  { id: 'smooth', name: 'Linear Smooth' },
                  { id: 'crt', name: 'CRT Curved Retro' }
                ].map(filter => (
                  <button 
                    key={filter.id}
                    onClick={() => updateSettings({ emulatorFilter: filter.id as any })}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all ${settings.emulatorFilter === filter.id ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/5 bg-black/20 text-white/60'}`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-medium">Screen Aspect Ratio</h3>
              <p className="text-white/50 text-sm">Adapt emulation video scaling structure</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '4:3', name: 'Classic Retro (4:3)' },
                  { id: '16:9', name: 'Widescreen (16:9)' },
                  { id: 'stretch', name: 'Stretch Fit' }
                ].map(aspect => (
                  <button 
                    key={aspect.id}
                    onClick={() => updateSettings({ emulatorAspectRatio: aspect.id as any })}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all ${settings.emulatorAspectRatio === aspect.id ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/5 bg-black/20 text-white/60'}`}
                  >
                    {aspect.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-medium">Rewind Buffer Duration</h3>
                  <p className="text-white/50 text-sm">Allocate live memory buffers for real-time rewinding capability</p>
                </div>
                <span className="text-2xl font-bold text-indigo-400 font-mono">{settings.emulatorRewind} sec</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="15" 
                value={settings.emulatorRewind} 
                onChange={e => updateSettings({ emulatorRewind: parseInt(e.target.value) })}
                className="w-full accent-indigo-500 h-1 bg-white/20 rounded-lg cursor-pointer" 
              />
            </div>
          </div>
        );

      case 'controller':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">Controller Settings</h2>
                <p className="text-white/50 text-sm mt-1">Configure keyboard bindings, active mappings, and test vibration feedback</p>
              </div>
              <button 
                onClick={testRumble}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${rumbleTest ? 'bg-indigo-600 animate-bounce' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <Radio className="w-5 h-5 text-indigo-400" /> {rumbleTest ? 'Vibrating...' : 'Test Rumble Feedback'}
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-2">Keyboard Bindings Remap</h3>
              <p className="text-white/40 text-xs mb-4">Click a button to map it to a physical keyboard key</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(keyMappings).map((btn) => (
                  <div key={btn} className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col justify-between items-center gap-2">
                    <span className="text-sm text-white/50">{btn}</span>
                    <button 
                      onClick={() => handleRemapClick(btn)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 hover:border-white/30 border border-white/10 rounded-lg text-sm text-indigo-300 font-mono transition-all w-full text-center"
                    >
                      {remapKey === btn ? 'Press any Key...' : keyMappings[btn]}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold">Smartphone Controller Pairing</h3>
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2">
                <p className="text-sm text-indigo-200">
                  You can pair any smartphone as a virtual touchscreen gamepad!
                </p>
                <p className="text-xs text-white/50">
                  Open the unique accessories link on your phone and input the console active session code to play retro games with touch triggers.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold">Active Connected Interfaces</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                    <div>
                      <h4 className="font-bold text-sm">Keyboard Link (Emulated)</h4>
                      <p className="text-xs text-white/40">Active control mapping layout #1</p>
                    </div>
                  </div>
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded font-bold">PORT 1</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-zinc-500 rounded-full" />
                    <div>
                      <h4 className="font-bold text-sm">DualSense Bluetooth Controller</h4>
                      <p className="text-xs text-white/40">Standby bluetooth discovery mode</p>
                    </div>
                  </div>
                  <span className="text-xs bg-white/10 text-white/60 px-2.5 py-1 rounded font-bold">PORT 2</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">Performance & Diagnostics</h2>
                <p className="text-white/50 text-sm mt-1">Configure thread speed targets, latency ping routes, and test hardware stability</p>
              </div>
              <button 
                onClick={runLatencyTest}
                disabled={latencyTesting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Server className="w-5 h-5" />
                {latencyTesting ? 'Testing Latency...' : 'Test Connection Latency'}
              </button>
            </div>

            {latencyResult && (
              <div className="grid grid-cols-3 gap-4 bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-2xl text-center">
                <div>
                  <span className="text-white/50 text-xs uppercase tracking-widest font-bold block mb-1">Ping Latency</span>
                  <span className="text-3xl font-mono font-bold text-indigo-300">{latencyResult.ping} ms</span>
                </div>
                <div>
                  <span className="text-white/50 text-xs uppercase tracking-widest font-bold block mb-1">Jitter Jolt</span>
                  <span className="text-3xl font-mono font-bold text-indigo-300">{latencyResult.jitter} ms</span>
                </div>
                <div>
                  <span className="text-white/50 text-xs uppercase tracking-widest font-bold block mb-1">Bandwidth Limit</span>
                  <span className="text-3xl font-mono font-bold text-indigo-300">{latencyResult.speed} Mbps</span>
                </div>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Low-Latency WebAssembly Engine</h3>
                <p className="text-white/50 text-sm">Boost thread frame outputs to max capabilities</p>
              </div>
              <button 
                onClick={() => updateSettings({ performanceMode: !settings.performanceMode })}
                className={`w-14 h-8 rounded-full transition-colors relative ${settings.performanceMode ? 'bg-indigo-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.performanceMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-medium">Emulation FPS Target Cap</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '30', label: '30 FPS (Power Save)' },
                  { id: '60', label: '60 FPS (Ultra-Smooth)' },
                  { id: 'uncapped', label: 'Uncapped Rendering' }
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => updateSettings({ frameRateTarget: item.id as any })}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all ${settings.frameRateTarget === item.id ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/5 bg-black/20 text-white/60'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">Microphone Input Signal</h3>
                  <p className="text-white/50 text-sm">Diagnose voice volume buffers for multiplayer modes</p>
                </div>
                <button 
                  onClick={() => setVoiceTesting(!voiceTesting)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${voiceTesting ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <Mic className="w-4 h-4 text-indigo-400" />
                  {voiceTesting ? 'Stop Mic' : 'Test Mic'}
                </button>
              </div>
              <div className="h-8 bg-black/40 border border-white/5 rounded-xl flex items-center justify-center px-4 gap-1 overflow-hidden">
                {voiceVolume.map((vol, i) => (
                  <div 
                    key={i} 
                    className="w-2 bg-indigo-500 rounded transition-all duration-100" 
                    style={{ height: `${vol}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Hardware Diagnostics Panel</h3>
                <button 
                  onClick={runDiagnostics}
                  disabled={diagnosticRunning}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${diagnosticRunning ? 'animate-spin' : ''}`} />
                  {diagnosticRunning ? 'Running diagnostics...' : 'Run Diagnostics'}
                </button>
              </div>
              {diagnosticLogs.length > 0 && (
                <div className="bg-black/80 border border-white/10 p-5 rounded-2xl font-mono text-[10px] text-green-400 space-y-1 h-36 overflow-y-auto">
                  {diagnosticLogs.map((log, i) => <div key={i}>&gt; {log}</div>)}
                </div>
              )}
            </div>
          </div>
        );

      case 'cloud_storage':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">Cloud Saves & Storage</h2>
                <p className="text-white/50 text-sm mt-1">Keep your high scores and game progress synchronized safely online via Firebase</p>
              </div>
              <button 
                onClick={forceCloudSync}
                disabled={cloudSyncing}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${cloudSyncing ? 'animate-spin' : ''}`} />
                Force Cloud Backup
              </button>
            </div>

            {syncMessage && (
              <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl text-indigo-200 text-sm">
                {syncMessage}
              </div>
            )}

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Automatic Firebase Synced Saves</h3>
                <p className="text-white/50 text-sm">Automatically pack and sync save blocks on game exits</p>
              </div>
              <button 
                onClick={() => updateSettings({ cloudSyncEnabled: !settings.cloudSyncEnabled })}
                className={`w-14 h-8 rounded-full transition-colors relative ${settings.cloudSyncEnabled ? 'bg-indigo-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.cloudSyncEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold">Active Save Backups</h3>
              <div className="space-y-2">
                {[
                  { game: 'Super Mario 64', size: '14 KB', slot: 'Save Slot 1', time: 'Last Backed Up: Just Now' },
                  { game: 'The Legend of Zelda: Ocarina of Time', size: '124 KB', slot: 'Save Slot 3', time: 'Last Backed Up: 2 hours ago' }
                ].map((save, i) => (
                  <div key={i} className="flex justify-between items-center p-3.5 bg-black/30 rounded-xl border border-white/5">
                    <div>
                      <h4 className="font-bold text-sm">{save.game}</h4>
                      <p className="text-xs text-white/40">{save.slot} • {save.size} • {save.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all">Restore</button>
                      <button className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold transition-all">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-medium">System Storage Usage</h3>
                  <p className="text-white/50 text-sm mt-1">Local Browser IndexedDB buffers</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-mono">
                    {parseFloat((availableStorage.games + availableStorage.saves).toFixed(1))} GB{' '}
                    <span className="text-lg text-white/50 font-normal">/ {(availableStorage.games + availableStorage.saves + availableStorage.free).toFixed(0)} GB</span>
                  </p>
                </div>
              </div>
              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden flex">
                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(availableStorage.games / 10) * 100}%` }} />
                <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${(availableStorage.saves / 10) * 100}%` }} />
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-white/60">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"/> Games ({availableStorage.games.toFixed(1)} GB)
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"/> Save Files ({availableStorage.saves.toFixed(1)} GB)
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10"/> Free Space ({availableStorage.free.toFixed(1)} GB)
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold">Bandwidth Speed Limit</h3>
              <div className="flex items-center justify-between">
                <p className="text-white/50 text-sm">Limit server-side ROM download speed triggers</p>
                <select 
                  value={settings.downloadLimit}
                  onChange={e => updateSettings({ downloadLimit: e.target.value as any })}
                  className="bg-black/50 border border-white/10 text-white rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 font-bold text-sm cursor-pointer"
                >
                  <option value="unlimited">Unlimited speed</option>
                  <option value="5">5 MB/s cap</option>
                  <option value="10">10 MB/s cap</option>
                  <option value="20">20 MB/s cap</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={clearROMCache}
                className="flex-1 bg-red-600/20 hover:bg-red-600 hover:text-white text-red-300 py-3.5 rounded-xl font-bold transition-all border border-red-500/20 text-center text-sm"
              >
                Clear Cached ROM Buffers
              </button>
              <button 
                onClick={() => {
                  setAvailableStorage(prev => ({ ...prev, saves: 0.1, free: prev.free + (prev.saves - 0.1) }));
                  alert('All local save states cleared successfully!');
                }}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3.5 rounded-xl font-bold transition-all border border-white/10 text-center text-sm"
              >
                Reset Save State Logs
              </button>
            </div>
          </div>
        );

      case 'themes':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Themes & Wallpaper</h2>
              <p className="text-white/50 text-sm mt-1">Select visual accent style and customize wallpaper desktop gradients</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Midnight Dark Palette</h3>
                <p className="text-white/50 text-sm">Switch to eye-safe midnight black colors</p>
              </div>
              <button 
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className={`w-14 h-8 rounded-full transition-colors relative ${settings.darkMode ? 'bg-indigo-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.darkMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold">Active Palette Accent Theme</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Cosmic Slate', 'Neon Vapor', 'Midnight Blue', 'Retro Classic'].map(theme => (
                  <button 
                    key={theme}
                    onClick={() => updateSettings({ theme })}
                    className={`p-5 rounded-2xl border text-left transition-all ${settings.theme === theme ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                  >
                    <h4 className="text-lg font-bold">{theme}</h4>
                    {settings.theme === theme ? (
                      <div className="mt-2 text-indigo-400 text-xs font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Selected Accent
                      </div>
                    ) : (
                      <div className="mt-2 text-white/40 text-xs">Apply accent</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold font-sans">Wallpaper Desktop Gradient</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {WALLPAPERS.map(wall => (
                  <button 
                    key={wall.id}
                    onClick={() => updateSettings({ wallpaper: wall.bg })}
                    className={`relative aspect-[16/10] rounded-2xl overflow-hidden border transition-all ${settings.wallpaper === wall.bg ? 'border-indigo-500 ring-2 ring-indigo-500/40' : 'border-white/10 hover:border-white/30'}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${wall.bg}`} />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-3">
                      <span className="font-bold text-xs text-white drop-shadow-md">{wall.label}</span>
                    </div>
                    {settings.wallpaper === wall.bg && (
                      <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="text-xl font-medium">Brightness Level</h3>
                <p className="text-white/50 text-sm">Configure active console background luminance</p>
              </div>
              <div className="flex items-center gap-4">
                <Moon className="w-5 h-5 text-white/40" />
                <input type="range" min="20" max="100" defaultValue="90" className="w-full accent-indigo-500 h-1 bg-white/20 rounded-lg cursor-pointer" />
                <Play className="w-5 h-5 text-indigo-400 rotate-90" />
              </div>
            </div>
          </div>
        );

      case 'profile':
        const wishlistGames = games.filter(g => wishlist.includes(g.id));
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Gamer Profile & Badges</h2>
              <p className="text-white/50 text-sm mt-1">Configure your gamer identity, unlockable achievements, and wishlists</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <img src={avatar} alt="Profile Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-xl" />
                <button 
                  onClick={() => {
                    const nextAvatar = prompt("Enter Image URL for avatar:");
                    if (nextAvatar) setAvatar(nextAvatar);
                  }}
                  className="absolute inset-0 bg-black/75 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer font-bold text-center"
                >
                  Change Image
                </button>
              </div>
              <div className="flex-1 text-center md:text-left space-y-2">
                <input 
                  type="text" 
                  value={profileName} 
                  onChange={e => setProfileName(e.target.value)}
                  className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-indigo-500 focus:outline-none text-2xl font-bold text-white"
                />
                <input 
                  type="text" 
                  value={profileBio} 
                  onChange={e => setProfileBio(e.target.value)}
                  placeholder="Enter status/bio..."
                  className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-indigo-500 focus:outline-none text-white/50 text-sm block w-full"
                />
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center min-w-[130px]">
                <Trophy className="w-7 h-7 text-amber-400 mx-auto mb-1" />
                <span className="text-2xl font-bold font-mono">14,200</span>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-extrabold mt-1">GamerScore</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold">User Level Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level 24 (Retro Adept)</span>
                  <span className="font-mono text-indigo-400">8,200 / 10,000 XP</span>
                </div>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-6 rounded-3xl relative overflow-hidden">
              <span className="text-indigo-400 text-xs uppercase tracking-widest font-bold block mb-2">Current Subscription Tier</span>
              <h3 className="text-3xl font-extrabold mb-1">{settings.subscriptionTier}</h3>
              <p className="text-white/50 text-xs leading-relaxed mb-4">Enjoy unlimited high-bandwidth save state caching storage nodes worldwide.</p>
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3">
                <h4 className="text-sm font-bold">Redeem Promo Code Voucher</h4>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Voucher Code (Try 'SUN50')" 
                    value={voucherCode}
                    onChange={e => setVoucherCode(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-xl p-2.5 text-white flex-1 focus:border-indigo-500 focus:outline-none text-sm font-semibold"
                  />
                  <button 
                    onClick={redeemCode}
                    className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {voucherMessage && <p className="text-xs text-indigo-300 font-bold">{voucherMessage}</p>}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold">Achievements Badge Progress</h3>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                {achievements.map(ach => (
                  <div key={ach.id} className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${ach.unlocked ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${ach.unlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-white/40'}`}>
                        🏆
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{ach.title}</h4>
                        <p className="text-xs text-white/60 mt-0.5">{ach.desc}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${ach.unlocked ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/10 text-white/40'}`}>
                      {ach.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold">Games Wishlist</h3>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                {wishlistGames.map(game => (
                  <div key={game.id} className="bg-white/5 p-3 rounded-xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3">
                      {game.coverImage && <img src={game.coverImage} alt="" className="w-12 h-12 object-cover rounded-lg" />}
                      <div>
                        <h4 className="font-bold text-sm">{game.name}</h4>
                        <p className="text-xs text-white/40">{game.size} • Core: {game.core}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleWishlist(game.id)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-lg font-bold transition-all text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {wishlistGames.length === 0 && (
                  <div className="text-center text-white/30 py-8">
                    <Heart className="w-12 h-12 text-white/10 mx-auto mb-2" />
                    <p className="text-sm">Your wishlist is currently empty.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">System Info & Help</h2>
              <p className="text-white/50 text-sm mt-1">Configure language, region, explore guides, and connect support pipelines</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="text-xl font-medium mb-4">System Language</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['English', 'Spanish', 'French', 'Japanese', 'Bengali'].map(lang => (
                  <button 
                    key={lang}
                    onClick={() => updateSettings({ language: lang })}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-sm ${settings.language === lang ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold' : 'border-white/5 hover:bg-white/5 text-white/70'}`}
                  >
                    <span>{lang}</span>
                    {settings.language === lang && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="text-xl font-medium mb-4">Console Active Region</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['North America', 'Europe', 'Asia', 'South America'].map(reg => (
                  <button 
                    key={reg}
                    onClick={() => updateSettings({ region: reg })}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-sm ${settings.region === reg ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold' : 'border-white/5 hover:bg-white/5 text-white/70'}`}
                  >
                    <span>{reg}</span>
                    {settings.region === reg && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Over-The-Air Software Updates</h3>
                <button 
                  onClick={checkUpdates}
                  disabled={checkingUpdate}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checkingUpdate ? 'animate-spin' : ''}`} />
                  {checkingUpdate ? 'Polling...' : 'Check for Update'}
                </button>
              </div>
              {updateMessage && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl text-indigo-200 text-xs font-semibold">
                  {updateMessage}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
                <div className="space-y-2">
                  {faqs.map((faq, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                        className="w-full text-left p-3.5 font-bold text-xs flex justify-between items-center hover:bg-white/5 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronRight className={`w-4 h-4 text-white/50 transition-transform ${activeFaq === i ? 'rotate-90' : ''}`} />
                      </button>
                      {activeFaq === i && (
                        <div className="p-4 bg-black/30 border-t border-white/5 text-xs text-white/70 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
                <h3 className="text-xl font-semibold">Contact Support</h3>
                {supportSubmitted ? (
                  <div className="bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-xl text-indigo-200 text-center space-y-2 animate-fade-in">
                    <Check className="w-8 h-8 text-green-400 mx-auto" />
                    <h4 className="font-bold text-sm">Feedback Submitted</h4>
                    <p className="text-[10px] text-white/50 leading-relaxed">Thank you! Your ticket response has been recorded successfully. Our support engineers will check your diagnostics details shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setSupportSubmitted(true); }} className="space-y-3">
                    <input type="text" required placeholder="Gamer ID / Name" className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs" />
                    <input type="email" required placeholder="Email Address" className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs" />
                    <textarea required placeholder="Write message or report console logs..." className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white min-h-[80px] focus:outline-none focus:border-indigo-500 text-xs" />
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-all text-xs">Submit Ticket</button>
                  </form>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3">
              <h3 className="text-xl font-bold text-white">SUN EMULATOR OS</h3>
              <p className="text-white/50 text-xs">Version: 1.0.1-Stable Channel (LTS)</p>
              <p className="text-white/50 text-xs">Core Engine: RetroArch JS & WebAssembly WebGPU v1.0.1</p>
              <div className="h-px bg-white/10 my-2" />
              <p className="text-white/70 text-xs leading-relaxed">
                A beautiful, open-source custom-crafted emulation web operating system designed for next-generation virtual controls pairing, responsive high-bandwidth game ROM distribution, and automatic cloud backups.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full bg-[#0a0a0a] text-white flex overflow-hidden">
      <div className="w-80 bg-black/50 border-r border-white/10 overflow-y-auto shrink-0 pb-10">
        <div className="p-8 sticky top-0 bg-black/50 backdrop-blur-xl z-10">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-white/40 text-xs mt-1">SunOS Configuration Center</p>
        </div>
        <div className="px-4 space-y-1.5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex flex-col items-start p-4 rounded-2xl text-left transition-all ${isActive ? 'bg-indigo-600' : 'hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                  <span className={`font-bold text-sm ${isActive ? 'text-white' : 'text-white/80'}`}>{item.label}</span>
                </div>
                <p className={`text-[10px] mt-1.5 leading-relaxed ${isActive ? 'text-white/60' : 'text-white/40'}`}>{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-12 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
