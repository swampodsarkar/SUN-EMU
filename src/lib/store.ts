import { create } from 'zustand';

interface Game {
  id: string;
  name: string;
  size: string;
  rawLink: string;
  coverImage: string;
  core: string; // add core field
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
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  addGame: (game: Omit<Game, 'id'>) => void;
  deleteGame: (id: string) => void;
  toggleBanUser: (email: string) => void;
  addNews: (news: Omit<News, 'id' | 'date'>) => void;
  deleteNews: (id: string) => void;
  playGame: (id: string) => void;
  incrementGuestCount: () => void;
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
    }
  ],
  news: [
    {
      id: '1',
      title: 'Welcome to SUN EMULATOR',
      content: 'Enjoy playing all your favorite retro games in one place.',
      date: new Date().toISOString()
    }
  ],
  guestCount: Math.floor(Math.random() * 50) + 10, // Simulated initial guest count
  gamePlays: { '1': 42 }, // Some mock data
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
      return true;
    }
    // Generic user logic
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
       return true;
    }
    return false;
  },
  logout: () => set({ currentUser: null }),
  addGame: (game) => set(state => ({ games: [...state.games, { ...game, id: Math.random().toString(36).substr(2, 9) }] })),
  deleteGame: (id) => set(state => ({ games: state.games.filter(g => g.id !== id) })),
  toggleBanUser: (email) => set(state => ({
    users: state.users.map(u => u.email === email ? { ...u, banned: !u.banned } : u)
  })),
  addNews: (news) => set(state => ({ news: [...state.news, { ...news, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString() }] })),
  deleteNews: (id) => set(state => ({ news: state.news.filter(n => n.id !== id) })),
  playGame: (id) => set(state => ({ gamePlays: { ...state.gamePlays, [id]: (state.gamePlays[id] || 0) + 1 } })),
  incrementGuestCount: () => set(state => ({ guestCount: state.guestCount + 1 }))
}));
