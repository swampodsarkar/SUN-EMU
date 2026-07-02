import { create } from 'zustand';

export interface AppSettings {
  darkMode: boolean;
  language: string;
  region: string;
  notifications: boolean;
  notificationSound: boolean;
  performanceMode: boolean;
  autoUpdate: boolean;
  voiceChat: boolean;
  remotePlay: boolean;
  theme: string;
  wallpaper: string; // Background style (e.g. gradient class or image URL)
  emulatorFilter: 'none' | 'scanlines' | 'smooth' | 'crt';
  emulatorAspectRatio: '4:3' | '16:9' | 'stretch';
  emulatorRewind: number; // in seconds
  pinCode: string;
  twoFactorEnabled: boolean;
  micVolume: number;
  frameRateTarget: '30' | '60' | 'uncapped';
  cloudSyncEnabled: boolean;
  downloadLimit: 'unlimited' | '5' | '10' | '20';
  subscriptionTier: 'Free' | 'Gold Member' | 'Ultimate Retro Gamer';
}

interface Game {
  id: string;
  name: string;
  size: string;
  rawLink: string;
  coverImage: string;
  core: string;
}

interface User {
  email: string;
  banned: boolean;
}

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface GlobalState {
  currentUser: User | null;
  users: User[];
  games: Game[];
  news: News[];
  guestCount: number;
  gamePlays: Record<string, number>;
  settings: AppSettings;
  wishlist: string[];
  achievements: { id: string; title: string; desc: string; unlocked: boolean; progress: number }[];
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  addGame: (game: Omit<Game, 'id'>) => void;
  deleteGame: (id: string) => void;
  toggleBanUser: (email: string) => void;
  addNews: (news: Omit<News, 'id' | 'date'>) => void;
  deleteNews: (id: string) => void;
  playGame: (id: string) => void;
  incrementGuestCount: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleWishlist: (gameId: string) => void;
  unlockAchievement: (id: string) => void;
}

export const useStore = create<GlobalState>((set, get) => ({
  currentUser: null,
  users: [{ email: 'mdswampodsarkar@gmail.com', banned: false }],
  games: [
    {
      id: '1',
      name: 'Super Mario 64',
      size: '8 MB',
      rawLink: 'https://example.com/sm64.z64',
      coverImage: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2574&auto=format&fit=crop',
      core: 'n64'
    },
    {
      id: '2',
      name: 'The Legend of Zelda: Ocarina of Time',
      size: '32 MB',
      rawLink: 'https://example.com/zelda.z64',
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2570&auto=format&fit=crop',
      core: 'n64'
    },
    {
      id: '3',
      name: 'Sonic the Hedgehog',
      size: '4 MB',
      rawLink: 'https://example.com/sonic.bin',
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2570&auto=format&fit=crop',
      core: 'segaMD'
    }
  ],
  news: [
    {
      id: '1',
      title: 'Welcome to SUN EMULATOR',
      content: 'Enjoy playing all your favorite retro games in one place with ultra-fast cloud performance, customized controller linking, and zero-setup requirements.',
      date: new Date().toISOString()
    }
  ],
  guestCount: Math.floor(Math.random() * 50) + 120, // Real-time simulated counts
  gamePlays: { '1': 142, '2': 98, '3': 73 },
  wishlist: ['2'],
  achievements: [
    { id: '1', title: 'First Launch', desc: 'Booted up the SUN EMULATOR OS for the first time', unlocked: true, progress: 100 },
    { id: '2', title: 'Power User', desc: 'Add a custom ROM or game link to the store library', unlocked: false, progress: 0 },
    { id: '3', title: 'Retro Gamer', desc: 'Successfully download and play a classic game', unlocked: false, progress: 0 },
    { id: '4', title: 'Theme Collector', desc: 'Change the system accent theme or active wallpaper', unlocked: false, progress: 0 },
    { id: '5', title: 'Social Networker', desc: 'Sign in to your personalized user account profile', unlocked: false, progress: 0 }
  ],
  settings: {
    darkMode: true,
    language: 'English',
    region: 'North America',
    notifications: true,
    notificationSound: true,
    performanceMode: true,
    autoUpdate: true,
    voiceChat: false,
    remotePlay: false,
    theme: 'Cosmic Slate',
    wallpaper: 'from-slate-950 via-zinc-900 to-indigo-950', // Default gorgeous gradient
    emulatorFilter: 'crt',
    emulatorAspectRatio: '4:3',
    emulatorRewind: 5,
    pinCode: '',
    twoFactorEnabled: false,
    micVolume: 80,
    frameRateTarget: '60',
    cloudSyncEnabled: true,
    downloadLimit: 'unlimited',
    subscriptionTier: 'Ultimate Retro Gamer'
  },
  login: (email, pass) => {
    if (email === 'mdswampodsarkar@gmail.com' && pass === '123456') {
      const users = get().users;
      let user = users.find(u => u.email === email);
      if (!user) {
        user = { email, banned: false };
        set({ users: [...users, user] });
      }
      if (user.banned) {
        alert("You are banned!");
        return false;
      }
      set({ currentUser: user });
      get().unlockAchievement('5');
      return true;
    }
    if (pass === '123456') {
       const users = get().users;
       let user = users.find(u => u.email === email);
       if (!user) {
         user = { email, banned: false };
         set({ users: [...users, user] });
       }
       if (user.banned) {
         alert("You are banned!");
         return false;
       }
       set({ currentUser: user });
       get().unlockAchievement('5');
       return true;
    }
    return false;
  },
  logout: () => set({ currentUser: null }),
  addGame: (game) => set(state => {
    setTimeout(() => get().unlockAchievement('2'), 100);
    return { games: [...state.games, { ...game, id: Math.random().toString(36).substr(2, 9) }] };
  }),
  deleteGame: (id) => set(state => ({ games: state.games.filter(g => g.id !== id) })),
  toggleBanUser: (email) => set(state => ({
    users: state.users.map(u => u.email === email ? { ...u, banned: !u.banned } : u)
  })),
  addNews: (news) => set(state => ({ news: [...state.news, { ...news, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString() }] })),
  deleteNews: (id) => set(state => ({ news: state.news.filter(n => n.id !== id) })),
  playGame: (id) => set(state => {
    setTimeout(() => get().unlockAchievement('3'), 100);
    return { gamePlays: { ...state.gamePlays, [id]: (state.gamePlays[id] || 0) + 1 } };
  }),
  incrementGuestCount: () => set(state => ({ guestCount: state.guestCount + 1 })),
  updateSettings: (newSettings) => set((state) => {
    if (newSettings.theme || newSettings.wallpaper) {
      setTimeout(() => get().unlockAchievement('4'), 100);
    }
    return { settings: { ...state.settings, ...newSettings } };
  }),
  toggleWishlist: (gameId) => set(state => ({
    wishlist: state.wishlist.includes(gameId) 
      ? state.wishlist.filter(id => id !== gameId) 
      : [...state.wishlist, gameId]
  })),
  unlockAchievement: (id) => set(state => ({
    achievements: state.achievements.map(a => a.id === id ? { ...a, unlocked: true, progress: 100 } : a)
  }))
}));
