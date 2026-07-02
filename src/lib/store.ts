import { create } from 'zustand';
import { db } from './firebase';
import { ref, onValue, set as setFirebase, remove } from 'firebase/database';

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
  downloadedGameIds: string[];
  downloadGame: (gameId: string) => void;
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
  downloadedGameIds: [],
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
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'mdswampodsarkar@gmail.com' && pass === '123456') {
      const users = get().users;
      let user = users.find(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
      if (!user) {
        user = { email: cleanEmail, banned: false };
        const userKey = cleanEmail.replace(/[\.\#\$\[\]]/g, '_');
        setFirebase(ref(db, `users/${userKey}`), user);
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
       let user = users.find(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
       if (!user) {
         user = { email: cleanEmail, banned: false };
         const userKey = cleanEmail.replace(/[\.\#\$\[\]]/g, '_');
         setFirebase(ref(db, `users/${userKey}`), user);
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
  addGame: (game) => {
    const id = Math.random().toString(36).substr(2, 9);
    setFirebase(ref(db, `games/${id}`), game);
    setTimeout(() => get().unlockAchievement('2'), 100);
  },
  deleteGame: (id) => {
    remove(ref(db, `games/${id}`));
  },
  toggleBanUser: (email) => {
    if (!email) return;
    const cleanEmail = email.trim().toLowerCase();
    const userKey = cleanEmail.replace(/[\.\#\$\[\]]/g, '_');
    const users = get().users;
    const user = users.find(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
    if (user) {
      setFirebase(ref(db, `users/${userKey}`), {
        email: cleanEmail,
        banned: !user.banned
      });
    }
  },
  addNews: (news) => {
    const id = Math.random().toString(36).substr(2, 9);
    setFirebase(ref(db, `news/${id}`), {
      ...news,
      date: new Date().toISOString()
    });
  },
  deleteNews: (id) => {
    remove(ref(db, `news/${id}`));
  },
  playGame: (id) => {
    const count = get().gamePlays[id] || 0;
    setFirebase(ref(db, `gamePlays/${id}`), count + 1);
    setTimeout(() => get().unlockAchievement('3'), 100);
  },
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
  })),
  downloadGame: (gameId) => set(state => {
    if (state.downloadedGameIds.includes(gameId)) return state;
    return { downloadedGameIds: [...state.downloadedGameIds, gameId] };
  })
}));

// Subscribe/sync listeners with Firebase Realtime Database
onValue(ref(db, 'games'), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const gamesList = Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
    useStore.setState({ games: gamesList });
  } else {
    const initialGames = {
      '1': {
        name: 'Super Mario 64',
        size: '8 MB',
        rawLink: 'https://example.com/sm64.z64',
        coverImage: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2574&auto=format&fit=crop',
        core: 'n64'
      },
      '2': {
        name: 'The Legend of Zelda: Ocarina of Time',
        size: '32 MB',
        rawLink: 'https://example.com/zelda.z64',
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2570&auto=format&fit=crop',
        core: 'n64'
      },
      '3': {
        name: 'Sonic the Hedgehog',
        size: '4 MB',
        rawLink: 'https://example.com/sonic.bin',
        coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2570&auto=format&fit=crop',
        core: 'segaMD'
      }
    };
    setFirebase(ref(db, 'games'), initialGames);
  }
});

onValue(ref(db, 'news'), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const newsList = Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
    useStore.setState({ news: newsList });
  } else {
    const initialNews = {
      '1': {
        title: 'Welcome to SUN EMULATOR',
        content: 'Enjoy playing all your favorite retro games in one place with ultra-fast cloud performance, customized controller linking, and zero-setup requirements.',
        date: new Date().toISOString()
      }
    };
    setFirebase(ref(db, 'news'), initialNews);
  }
});

onValue(ref(db, 'users'), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const usersList = Object.keys(data).map(key => ({
      email: data[key]?.email || '',
      banned: !!data[key]?.banned
    })).filter(u => u.email && u.email.trim() !== '');
    useStore.setState({ users: usersList });
  } else {
    const initialUsers = {
      'admin': {
        email: 'mdswampodsarkar@gmail.com',
        banned: false
      }
    };
    setFirebase(ref(db, 'users'), initialUsers);
  }
});

onValue(ref(db, 'gamePlays'), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    useStore.setState({ gamePlays: data });
  } else {
    const initialGamePlays = { '1': 142, '2': 98, '3': 73 };
    setFirebase(ref(db, 'gamePlays'), initialGamePlays);
  }
});

