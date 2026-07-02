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
  { id: 'controller', label: 'Controller Settings', icon: Gamepad2, color: 'text-blue-400' },
  { id: 'cloud', label: 'Cloud Saves (Firebase)', icon: Cloud, color: 'text-sky-400' },
  { id: 'profile', label: 'User Profile', icon: User, color: 'text-indigo-400' },
  { id: 'themes', label: 'Themes', icon: Palette, color: 'text-pink-400' },
  { id: 'display', label: 'Dark/Light Mode', icon: Moon, color: 'text-slate-400' },
  { id: 'language', label: 'Language & Region', icon: Globe, color: 'text-emerald-400' },
  { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-yellow-400' },
  { id: 'security', label: 'Security (PIN, 2FA)', icon: Shield, color: 'text-red-400' },
  { id: 'storage', label: 'Storage Manager', icon: HardDrive, color: 'text-orange-400' },
  { id: 'emulator', label: 'Emulator Settings', icon: Settings2, color: 'text-gray-400' },
  { id: 'cloudgaming', label: 'Cloud Gaming Settings', icon: CloudLightning, color: 'text-purple-400' },
  { id: 'voice', label: 'Voice Chat', icon: Mic, color: 'text-green-400' },
  { id: 'remoteplay', label: 'Remote Play', icon: Wifi, color: 'text-blue-500' },
  { id: 'performance', label: 'Performance Mode', icon: Zap, color: 'text-yellow-500' },
  { id: 'wallpaper', label: 'Wallpaper Manager', icon: ImageIcon, color: 'text-pink-500' },
  { id: 'autoupdate', label: 'Auto Update', icon: RefreshCw, color: 'text-teal-400' },
  { id: 'downloads', label: 'Downloads Manager', icon: DownloadCloud, color: 'text-cyan-400' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, color: 'text-amber-400' },
  { id: 'wishlist', label: 'Wishlist', icon: Heart, color: 'text-rose-400' },
  { id: 'billing', label: 'Subscription & Billing', icon: CreditCard, color: 'text-emerald-500' },
  { id: 'support', label: 'Feedback & Support', icon: MessageSquare, color: 'text-indigo-300' },
  { id: 'about', label: 'About Console', icon: Info, color: 'text-gray-300' },
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
  const [activeTab, setActiveTab] = useState(MENU_ITEMS[0].id);
  const { settings, updateSettings, currentUser, wishlist, toggleWishlist, achievements, games, addGame } = useStore();

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
    { q: 'Can I upload my own ROM games?', a: 'Absolutely! Use the "Game Library" tile on the main homescreen to load custom ROM files (e.g. .nes, .smc, .z64) straight from your device local directory.' },
    { q: 'Where are my save files stored?', a: 'Save states are automatically packed and safely synchronized both locally inside your browser cache and remotely inside your linked cloud storage.' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'controller':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">Controller Settings</h2>
                <p className="text-white/50 text-sm mt-1">Configure buttons layout, key mappings, and test vibration feedback</p>
              </div>
              <button 
                onClick={testRumble}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${rumbleTest ? 'bg-indigo-600 animate-bounce' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <Radio className="w-5 h-5 text-indigo-400" /> {rumbleTest ? 'Vibrating...' : 'Test Rumble Feedback'}
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Keyboard remap controls</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              <h3 className="text-xl font-semibold">Active Connected Controllers</h3>
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
                      <p className="text-xs text-white/40">Offline / Standby pairing</p>
                    </div>
                  </div>
                  <span className="text-xs bg-white/10 text-white/60 px-2.5 py-1 rounded font-bold">PORT 2</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'cloud':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">Cloud Saves (Firebase)</h2>
                <p className="text-white/50 text-sm mt-1">Keep your high scores and game progress synchronized safely online</p>
              </div>
              <button 
                onClick={forceCloudSync}
                disabled={cloudSyncing}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${cloudSyncing ? 'animate-spin' : ''}`} />
                Force Backup Sync
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
                <p className="text-white/50 text-sm">Automatically sync state triggers on game exits</p>
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
                  { game: 'Legend of Zelda', size: '124 KB', slot: 'Save Slot 3', time: 'Last Backed Up: 2 hours ago' }
                ].map((save, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-black/30 rounded-xl border border-white/5">
                    <div>
                      <h4 className="font-bold text-sm">{save.game}</h4>
                      <p className="text-xs text-white/40">{save.slot} • {save.size} • {save.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold">Restore</button>
                      <button className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">User Profile</h2>
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6">
               <div className="relative group">
                 <img src={avatar} alt="Profile Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500" />
                 <button 
                  onClick={() => {
                    const nextAvatar = prompt("Enter Image URL for avatar:");
                    if (nextAvatar) setAvatar(nextAvatar);
                  }}
                  className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer font-bold"
                 >
                   Change Image
                 </button>
               </div>
               <div className="flex-1 text-center md:text-left space-y-2">
                  <input 
                    type="text" 
                    value={profileName} 
                    onChange={e => setProfileName(e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-indigo-500 focus:outline-none text-2xl font-bold"
                  />
                  <input 
                    type="text" 
                    value={profileBio} 
                    onChange={e => setProfileBio(e.target.value)}
                    placeholder="Enter status/bio..."
                    className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-indigo-500 focus:outline-none text-white/50 text-sm block w-full"
                  />
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center min-w-[120px]">
                  <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-1" />
                  <span className="text-2xl font-bold font-mono">14,200</span>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">GamerScore</p>
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
          </div>
        );
      case 'themes':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Themes</h2>
            <p className="text-white/50 text-sm">Choose active visual presentation theme and customize palette gradients</p>
            <div className="grid grid-cols-2 gap-4">
              {['Cosmic Slate', 'Neon Vapor', 'Midnight Blue', 'Retro Classic'].map(theme => (
                <button 
                  key={theme}
                  onClick={() => updateSettings({ theme })}
                  className={`p-6 rounded-2xl border text-left transition-all ${settings.theme === theme ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                >
                  <h3 className="text-xl font-bold">{theme}</h3>
                  {settings.theme === theme ? (
                    <div className="mt-2 text-indigo-400 text-sm font-medium flex items-center gap-1">
                      <Check className="w-4 h-4" /> Selected
                    </div>
                  ) : (
                    <div className="mt-2 text-white/40 text-sm">Click to apply</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      case 'display':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Display & Light Settings</h2>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Dark Mode</h3>
                <p className="text-white/50 text-sm">Switch to high contrast midnight palettes</p>
              </div>
              <button 
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className={`w-14 h-8 rounded-full transition-colors relative ${settings.darkMode ? 'bg-indigo-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.darkMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="text-xl font-medium">Brightness Level</h3>
                <p className="text-white/50 text-sm">Configure system screen overlay luminance</p>
              </div>
              <div className="flex items-center gap-4">
                <Moon className="w-5 h-5 text-white/40" />
                <input type="range" min="20" max="100" defaultValue="90" className="w-full accent-indigo-500 h-1 bg-white/20 rounded-lg cursor-pointer" />
                <SunIcon className="w-5 h-5 text-indigo-400" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="text-xl font-medium">Visual Text Scale</h3>
                <p className="text-white/50 text-sm">Adapt general UI elements to focus display comfort</p>
              </div>
              <div className="flex gap-4">
                {['Small', 'Medium', 'Large', 'Extra Large'].map((s, idx) => (
                  <button key={s} className={`flex-1 py-2.5 rounded-xl border text-sm font-bold ${idx === 1 ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/5 bg-black/20 text-white/60'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'language':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Language & Region</h2>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="text-xl font-medium mb-4">System Language</h3>
              <div className="grid grid-cols-2 gap-2">
                {['English', 'Spanish', 'French', 'Japanese', 'Bengali'].map(lang => (
                  <button 
                    key={lang}
                    onClick={() => updateSettings({ language: lang })}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${settings.language === lang ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/5 hover:bg-white/5 text-white/70'}`}
                  >
                    <span>{lang}</span>
                    {settings.language === lang && <Check className="w-5 h-5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="text-xl font-medium mb-4">Active Console Region</h3>
              <div className="grid grid-cols-2 gap-2">
                {['North America', 'Europe', 'Asia', 'South America'].map(reg => (
                  <button 
                    key={reg}
                    onClick={() => updateSettings({ region: reg })}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${settings.region === reg ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/5 hover:bg-white/5 text-white/70'}`}
                  >
                    <span>{reg}</span>
                    {settings.region === reg && <Check className="w-5 h-5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Notifications Settings</h2>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Allow Global Notifications</h3>
                <p className="text-white/50 text-sm">System messages, system triggers, and updates</p>
              </div>
              <button 
                onClick={() => updateSettings({ notifications: !settings.notifications })}
                className={`w-14 h-8 rounded-full transition-colors relative ${settings.notifications ? 'bg-indigo-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.notifications ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Notification Sound Alert</h3>
                <p className="text-white/50 text-sm">Play subtle vintage tone alerts on updates</p>
              </div>
              <button 
                onClick={() => updateSettings({ notificationSound: !settings.notificationSound })}
                className={`w-14 h-8 rounded-full transition-colors relative ${settings.notificationSound ? 'bg-indigo-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.notificationSound ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Security (PIN, 2FA)</h2>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="text-xl font-medium">Console Passcode PIN</h3>
                <p className="text-white/50 text-sm">Create a secure 4-digit lockout PIN</p>
              </div>
              <div className="flex gap-3">
                <input 
                  type="password" 
                  maxLength={4}
                  placeholder="••••"
                  value={pinEntry}
                  onChange={e => setPinEntry(e.target.value.replace(/\D/g, ''))}
                  className="bg-black/50 border border-white/10 rounded-xl p-3 text-center text-2xl font-mono tracking-widest text-white w-32 focus:border-indigo-500 focus:outline-none"
                />
                <button 
                  onClick={() => {
                    if (pinEntry.length === 4) {
                      updateSettings({ pinCode: pinEntry });
                      setSecurityMessage('PIN passcode has been set successfully!');
                      setPinEntry('');
                    } else {
                      setSecurityMessage('Please enter a valid 4-digit PIN code.');
                    }
                  }}
                  className="px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold"
                >
                  Save PIN
                </button>
              </div>
              {securityMessage && <p className="text-sm text-indigo-300 font-medium">{securityMessage}</p>}
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Enable 2FA Authenticator</h3>
                <p className="text-white/50 text-sm">Bind authenticator software for login verification protection</p>
              </div>
              <button 
                onClick={() => updateSettings({ twoFactorEnabled: !settings.twoFactorEnabled })}
                className={`w-14 h-8 rounded-full transition-colors relative ${settings.twoFactorEnabled ? 'bg-indigo-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.twoFactorEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {settings.twoFactorEnabled && (
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center">
                  <div className="w-full h-full bg-[radial-gradient(#000_3px,transparent_4px)] [background-size:10px_10px]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold">Scan QR Code</h4>
                  <p className="text-white/50 text-xs leading-relaxed">Scan with Google Authenticator or Microsoft Authenticator app to complete the multi-factor protection link setup.</p>
                </div>
              </div>
            )}
          </div>
        );
      case 'storage':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Storage Manager</h2>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
               <div className="flex justify-between items-end">
                  <div>
                     <h3 className="text-xl font-medium">System Storage Usage</h3>
                     <p className="text-white/50 text-sm mt-1">Local Browser IndexedDB buffers</p>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-bold">{parseFloat((availableStorage.games + availableStorage.saves).toFixed(1))} GB <span className="text-lg text-white/50 font-normal">/ {(availableStorage.games + availableStorage.saves + availableStorage.free).toFixed(0)} GB</span></p>
                  </div>
               </div>
               <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden flex">
                  <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(availableStorage.games / 10) * 100}%` }} />
                  <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${(availableStorage.saves / 10) * 100}%` }} />
               </div>
               <div className="flex flex-wrap gap-6 text-sm">
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

            <div className="flex gap-4">
              <button 
                onClick={clearROMCache}
                className="flex-1 bg-red-600/20 hover:bg-red-600 hover:text-white text-red-300 py-4 rounded-xl font-bold transition-all border border-red-500/20 text-center"
              >
                Clear Cached ROM Buffers
              </button>
              <button 
                onClick={() => {
                  setAvailableStorage(prev => ({ ...prev, saves: 0.1, free: prev.free + (prev.saves - 0.1) }));
                  alert('All local save states cleared successfully!');
                }}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold transition-all border border-white/10 text-center"
              >
                Reset Save State Logs
              </button>
            </div>
          </div>
        );
      case 'emulator':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Emulator Settings (RetroArch/JS)</h2>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-medium">Shader Screen Filter</h3>
              <p className="text-white/50 text-sm">Emulate vintage display screen technologies</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', name: 'None (Raw Pixel)' },
                  { id: 'scanlines', name: 'CRT Scanlines' },
                  { id: 'smooth', name: 'Linear Smooth' },
                  { id: 'crt', name: 'CRT Curved Retro' }
                ].map(filter => (
                  <button 
                    key={filter.id}
                    onClick={() => updateSettings({ emulatorFilter: filter.id as any })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${settings.emulatorFilter === filter.id ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/5 bg-black/20 text-white/60'}`}
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
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${settings.emulatorAspectRatio === aspect.id ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/5 bg-black/20 text-white/60'}`}
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
                  <p className="text-white/50 text-sm">Allocate time buffer memory for realtime rewinding</p>
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
      case 'cloudgaming':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">Cloud Gaming Settings</h2>
                <p className="text-white/50 text-sm mt-1">Configure live high-definition rom distribution stream nodes</p>
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
              <div className="grid grid-cols-3 gap-4 bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-2xl animate-fade-in text-center">
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

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold">Edge Server Node Location</h3>
              <div className="grid grid-cols-3 gap-3">
                {['Automatic Detect', 'US-East Node', 'Europe-West Node', 'Asia-East Node'].map((node, i) => (
                  <button key={node} className={`p-4 rounded-xl border text-sm font-bold ${i === 0 ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/5 bg-black/20 text-white/60'}`}>
                    {node}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'voice':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">Voice Chat Settings</h2>
                <p className="text-white/50 text-sm mt-1">Configure audio input signals and test voice activation levels</p>
              </div>
              <button 
                onClick={() => setVoiceTesting(!voiceTesting)}
                className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${voiceTesting ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <Mic className="w-5 h-5 text-indigo-400" />
                {voiceTesting ? 'Stop Mic Test' : 'Start Mic Diagnostic'}
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Allow Multiplayer Voice Channels</h3>
                <p className="text-white/50 text-sm">Link microphone when entering multi-user pairing</p>
              </div>
              <button 
                onClick={() => updateSettings({ voiceChat: !settings.voiceChat })}
                className={`w-14 h-8 rounded-full transition-colors relative ${settings.voiceChat ? 'bg-indigo-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.voiceChat ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">Microphone Input Level</h3>
                <span className="text-lg font-bold font-mono text-indigo-400">{settings.micVolume}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={settings.micVolume} 
                onChange={e => updateSettings({ micVolume: parseInt(e.target.value) })}
                className="w-full accent-indigo-500 h-1 bg-white/20 rounded-lg cursor-pointer" 
              />
              
              <div className="h-10 bg-black/40 border border-white/5 rounded-xl flex items-center justify-center px-4 gap-1.5 overflow-hidden">
                {voiceVolume.map((vol, i) => (
                  <div 
                    key={i} 
                    className="w-2.5 bg-indigo-500 rounded transition-all duration-100" 
                    style={{ height: `${vol}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 'remoteplay':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Remote Play</h2>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Activate Remote Streaming Node</h3>
                <p className="text-white/50 text-sm">Allow virtual controls connection streaming from secondary browser screen</p>
              </div>
              <button 
                onClick={() => updateSettings({ remotePlay: !settings.remotePlay })}
                className={`w-14 h-8 rounded-full transition-colors relative ${settings.remotePlay ? 'bg-indigo-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.remotePlay ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {settings.remotePlay && (
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                <h3 className="font-bold text-lg">Remote Device Pairing Code</h3>
                <p className="text-white/50 text-sm leading-relaxed">Enter this pairing code inside your remote browser window or console controller app to mirror the game viewport.</p>
                <div className="bg-black/50 border border-white/5 p-6 rounded-2xl flex items-center justify-center text-center">
                  <div>
                    <span className="text-4xl font-mono font-bold text-indigo-400 tracking-widest uppercase">7W9E</span>
                    <p className="text-xs text-white/30 tracking-wider mt-2 uppercase font-bold">LINK TOKEN CODE (ACTIVE)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'performance':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Performance Mode</h2>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">High Performance rendering (Low Latency)</h3>
                <p className="text-white/50 text-sm">Boost thread frame outputs to max capability limits</p>
              </div>
              <button 
                onClick={() => updateSettings({ performanceMode: !settings.performanceMode })}
                className={`w-14 h-8 rounded-full transition-colors relative ${settings.performanceMode ? 'bg-indigo-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.performanceMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-medium">System frame Rate Cap</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '30', label: '30 FPS (Power Save)' },
                  { id: '60', label: '60 FPS (Ultra-Smooth)' },
                  { id: 'uncapped', label: 'Uncapped Rendering' }
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => updateSettings({ frameRateTarget: item.id as any })}
                    className={`p-4 rounded-xl border text-sm font-bold transition-all ${settings.frameRateTarget === item.id ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/5 bg-black/20 text-white/60'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'wallpaper':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Wallpaper Manager</h2>
            <p className="text-white/50 text-sm">Customize visual presentation console desktop wallpapers</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {WALLPAPERS.map(wall => (
                <button 
                  key={wall.id}
                  onClick={() => updateSettings({ wallpaper: wall.bg })}
                  className={`relative aspect-[16/10] rounded-2xl overflow-hidden border transition-all ${settings.wallpaper === wall.bg ? 'border-indigo-500 ring-2 ring-indigo-500/40' : 'border-white/10 hover:border-white/30'}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${wall.bg}`} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-3">
                    <span className="font-bold text-sm text-white drop-shadow-md">{wall.label}</span>
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
        );
      case 'autoupdate':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">Auto Update Settings</h2>
                <p className="text-white/50 text-sm mt-1">Keep system software and emulators running on top release builds</p>
              </div>
              <button 
                onClick={checkUpdates}
                disabled={checkingUpdate}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${checkingUpdate ? 'animate-spin' : ''}`} />
                {checkingUpdate ? 'Polling Updates...' : 'Check System Update'}
              </button>
            </div>

            {updateMessage && (
              <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl text-indigo-200 text-sm font-medium">
                {updateMessage}
              </div>
            )}

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Automatic Software Updates</h3>
                <p className="text-white/50 text-sm">Download and install firmware builds over-the-air</p>
              </div>
              <button 
                onClick={() => updateSettings({ autoUpdate: !settings.autoUpdate })}
                className={`w-14 h-8 rounded-full transition-colors relative ${settings.autoUpdate ? 'bg-indigo-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${settings.autoUpdate ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        );
      case 'downloads':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Downloads Manager</h2>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Bandwidth Speed Limit</h3>
                <p className="text-white/50 text-sm">Limit distribution server download speeds</p>
              </div>
              <select 
                value={settings.downloadLimit}
                onChange={e => updateSettings({ downloadLimit: e.target.value as any })}
                className="bg-black/50 border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-indigo-500 font-bold"
              >
                <option value="unlimited">Unlimited speed</option>
                <option value="5">5 MB/s cap</option>
                <option value="10">10 MB/s cap</option>
                <option value="20">20 MB/s cap</option>
              </select>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold">Active ROM Downloads Queue</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <h4 className="font-bold text-sm">Super Mario 64.z64</h4>
                    <p className="text-xs text-white/40">Status: Completed • 8.0 MB</p>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded font-bold">100% SUCCESS</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <h4 className="font-bold text-sm">The Legend of Zelda.z64</h4>
                    <p className="text-xs text-white/40">Status: Completed • 32.0 MB</p>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded font-bold">100% SUCCESS</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'achievements':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Achievements Progress</h2>
            <p className="text-white/50 text-sm">Completed achievements and interactive trophies</p>
            
            <div className="space-y-4">
              {achievements.map(ach => (
                <div key={ach.id} className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${ach.unlocked ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/10 opacity-60'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${ach.unlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-white/40'}`}>
                      🏆
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{ach.title}</h4>
                      <p className="text-sm text-white/60 mt-1">{ach.desc}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${ach.unlocked ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/10 text-white/40'}`}>
                    {ach.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'wishlist':
        const wishlistGames = games.filter(g => wishlist.includes(g.id));
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Your Wishlist</h2>
            <p className="text-white/50 text-sm">Save customized classic retro links to install onto console later</p>
            
            <div className="space-y-4">
              {wishlistGames.map(game => (
                <div key={game.id} className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-4">
                    {game.coverImage && <img src={game.coverImage} alt="" className="w-16 h-16 object-cover rounded-xl" />}
                    <div>
                      <h4 className="font-bold text-lg">{game.name}</h4>
                      <p className="text-sm text-white/40">{game.size} • Core: {game.core}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleWishlist(game.id)}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-xl font-bold transition-all text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {wishlistGames.length === 0 && (
                <div className="text-center text-white/30 py-16">
                  <Heart className="w-16 h-16 text-white/10 mx-auto mb-4" />
                  <p className="text-xl">Your wishlist is empty.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Subscription & Billing</h2>
            
            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-8 rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
               <span className="text-indigo-400 text-xs uppercase tracking-widest font-bold block mb-2">Current Tier</span>
               <h3 className="text-4xl font-extrabold mb-2">{settings.subscriptionTier}</h3>
               <p className="text-white/60 text-sm">Enjoy unlimited high-bandwidth save state caching storage nodes worldwide.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold">Redeem Promo Code Voucher</h3>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Voucher Code (Try 'SUN50')" 
                  value={voucherCode}
                  onChange={e => setVoucherCode(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl p-3.5 text-white flex-1 focus:border-indigo-500 focus:outline-none"
                />
                <button 
                  onClick={redeemCode}
                  className="px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold"
                >
                  Apply Voucher
                </button>
              </div>
              {voucherMessage && <p className="text-sm text-indigo-300 font-medium">{voucherMessage}</p>}
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Feedback & Support</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                <h3 className="text-xl font-semibold">Contact Support</h3>
                {supportSubmitted ? (
                  <div className="bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-xl text-indigo-200 text-center space-y-2 animate-fade-in">
                    <Check className="w-10 h-10 text-green-400 mx-auto" />
                    <h4 className="font-bold">Feedback Submitted</h4>
                    <p className="text-xs text-white/50 leading-relaxed">Thank you! Your ticket response has been recorded successfully. Our engineers will check the diagnostics details.</p>
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setSupportSubmitted(true); }} className="space-y-4">
                    <input type="text" required placeholder="User Name" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 text-sm" />
                    <input type="email" required placeholder="Email Address" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 text-sm" />
                    <textarea required placeholder="Write message or report console logs..." className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white min-h-[100px] focus:outline-none focus:border-indigo-500 text-sm" />
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all">Submit Feedback</button>
                  </form>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
                <div className="space-y-2">
                  {faqs.map((faq, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                        className="w-full text-left p-4 font-bold text-sm flex justify-between items-center hover:bg-white/5 transition-colors"
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
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">About Console</h2>
                <p className="text-white/50 text-sm mt-1">Console specifications, diagnostic testing, and system information</p>
              </div>
              <button 
                onClick={runDiagnostics}
                disabled={diagnosticRunning}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${diagnosticRunning ? 'animate-spin' : ''}`} />
                {diagnosticRunning ? 'Running Hardware Test...' : 'Run Diagnostics Test'}
              </button>
            </div>

            {diagnosticLogs.length > 0 && (
              <div className="bg-black/80 border border-white/10 p-6 rounded-2xl font-mono text-xs text-green-400 space-y-1.5 h-44 overflow-y-auto">
                {diagnosticLogs.map((log, i) => <div key={i}>&gt; {log}</div>)}
              </div>
            )}

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-4">
               <h3 className="text-2xl font-bold text-white">SUN EMULATOR OS</h3>
               <p className="text-white/50">Version: 1.0.1-Stable Channel (LTS)</p>
               <p className="text-white/50">Core Engine: RetroArch JS & WebAssembly WebGPU v1.0.1</p>
               <div className="h-px bg-white/10 my-4" />
               <p className="text-white/70">A beautiful, open-source custom-crafted emulation web operating system designed for next-generation virtual controls pairing, responsive high-bandwidth game ROM distribution, and automatic cloud backups.</p>
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
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <div className="px-4 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${isActive ? 'bg-indigo-600' : 'hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-4">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                  <span className={`font-medium ${isActive ? 'text-white' : 'text-white/70'}`}>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-5 h-5 text-white/50" />}
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

function SunIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
