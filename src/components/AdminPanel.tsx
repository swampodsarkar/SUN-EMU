import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { X, Plus, Trash2, ShieldBan, ShieldAlert, Users, PlayCircle } from 'lucide-react';
import { SupportedCore } from '../types';

const CORES: { value: SupportedCore | '', label: string }[] = [
  { value: '', label: 'Select Core...' },
  { value: 'nes', label: 'Nintendo Entertainment System (NES)' },
  { value: 'snes', label: 'Super Nintendo (SNES)' },
  { value: 'n64', label: 'Nintendo 64 (N64)' },
  { value: 'gb', label: 'Game Boy' },
  { value: 'gbc', label: 'Game Boy Color' },
  { value: 'gba', label: 'Game Boy Advance (GBA)' },
  { value: 'nds', label: 'Nintendo DS (NDS)' },
  { value: 'sms', label: 'Sega Master System' },
  { value: 'segaMD', label: 'Sega Genesis / Mega Drive' },
  { value: 'gg', label: 'Sega Game Gear' },
  { value: 'segacd', label: 'Sega CD' },
  { value: '32x', label: 'Sega 32X' },
  { value: 'saturn', label: 'Sega Saturn' },
  { value: 'psx', label: 'Sony PlayStation (PS1)' },
  { value: 'atari2600', label: 'Atari 2600' },
  { value: 'atari5200', label: 'Atari 5200' },
  { value: 'atari7800', label: 'Atari 7800' },
  { value: 'lynx', label: 'Atari Lynx' },
  { value: 'jaguar', label: 'Atari Jaguar' },
  { value: 'neogeo', label: 'Neo Geo AES' },
  { value: 'ngp', label: 'Neo Geo Pocket' },
  { value: 'ngpc', label: 'Neo Geo Pocket Color' },
  { value: 'pce', label: 'PC Engine / TurboGrafx-16' },
  { value: 'pcecd', label: 'PC Engine CD' },
  { value: 'wswan', label: 'WonderSwan' },
  { value: 'wsc', label: 'WonderSwan Color' },
  { value: 'vb', label: 'Virtual Boy' },
  { value: 'coleco', label: 'ColecoVision' },
  { value: 'msx', label: 'MSX' },
  { value: 'dos', label: 'DOS (DOSBox)' },
  { value: 'arcade', label: 'Arcade' },
  { value: 'fba', label: 'Arcade (FinalBurn Neo)' }
];

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const store = useStore();
  const [tab, setTab] = useState<'stats' | 'games' | 'users' | 'news'>('stats');

  const [newGame, setNewGame] = useState({ name: '', size: '', rawLink: '', coverImage: '', core: '' });
  const [newNews, setNewNews] = useState({ title: '', content: '' });

  const handleAddGame = () => {
    if (newGame.name && newGame.rawLink && newGame.core) {
      store.addGame(newGame);
      setNewGame({ name: '', size: '', rawLink: '', coverImage: '', core: '' });
    }
  };

  const handleAddNews = () => {
    if (newNews.title && newNews.content) {
      store.addNews(newNews);
      setNewNews({ title: '', content: '' });
    }
  };
  
  const totalUsers = store.users.length;
  const activeGuests = store.guestCount;
  
  // Get top games
  const sortedGames = [...store.games].sort((a, b) => (store.gamePlays[b.id] || 0) - (store.gamePlays[a.id] || 0));

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 flex items-center justify-center p-8 backdrop-blur-xl">
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative text-white">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-red-500/90 text-white p-3 rounded-full transition-all">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8 border-b border-white/10 shrink-0">
          <h2 className="text-3xl font-bold">Admin Panel</h2>
          <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
            <button onClick={() => setTab('stats')} className={`px-6 py-2 rounded-full font-medium whitespace-nowrap ${tab === 'stats' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}>Dashboard Stats</button>
            <button onClick={() => setTab('games')} className={`px-6 py-2 rounded-full font-medium whitespace-nowrap ${tab === 'games' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}>Manage Games</button>
            <button onClick={() => setTab('users')} className={`px-6 py-2 rounded-full font-medium whitespace-nowrap ${tab === 'users' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}>Manage Users</button>
            <button onClick={() => setTab('news')} className={`px-6 py-2 rounded-full font-medium whitespace-nowrap ${tab === 'news' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}>Manage News</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {tab === 'stats' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 p-8 rounded-3xl border border-white/10 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white/60 text-lg font-medium">Registered Users</h3>
                    <p className="text-5xl font-bold mt-1">{totalUsers}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 p-8 rounded-3xl border border-white/10 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white/60 text-lg font-medium">Active Guests</h3>
                    <p className="text-5xl font-bold mt-1">{activeGuests}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <PlayCircle className="w-6 h-6 text-indigo-400" />
                  Most Played Games
                </h3>
                <div className="space-y-4">
                  {sortedGames.slice(0, 5).map((game, index) => (
                    <div key={game.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white/50">{index + 1}</div>
                        {game.coverImage && <img src={game.coverImage} alt="" className="w-12 h-12 object-cover rounded-lg" />}
                        <div>
                          <h4 className="font-bold">{game.name}</h4>
                          <span className="text-xs text-white/40 uppercase bg-white/10 px-2 py-0.5 rounded">{game.core}</span>
                        </div>
                      </div>
                      <div className="text-xl font-mono font-bold text-indigo-300">
                        {store.gamePlays[game.id] || 0} <span className="text-sm text-white/40 font-sans">plays</span>
                      </div>
                    </div>
                  ))}
                  {sortedGames.length === 0 && <p className="text-white/50">No games added yet.</p>}
                </div>
              </div>
            </div>
          )}

          {tab === 'games' && (
            <div className="space-y-8">
              <div className="bg-white/5 p-8 rounded-3xl space-y-6 border border-white/10">
                <h3 className="text-2xl font-bold">Add New Game</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input type="text" placeholder="Game Name" className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 focus:outline-none transition-colors" value={newGame.name} onChange={e => setNewGame({...newGame, name: e.target.value})} />
                  <input type="text" placeholder="Size (e.g. 50MB)" className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 focus:outline-none transition-colors" value={newGame.size} onChange={e => setNewGame({...newGame, size: e.target.value})} />
                  
                  <select 
                    className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 focus:outline-none transition-colors col-span-1 md:col-span-2"
                    value={newGame.core}
                    onChange={e => setNewGame({...newGame, core: e.target.value})}
                  >
                    {CORES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>

                  <input type="text" placeholder="Raw ROM/ISO Download Link" className="bg-black/50 border border-white/10 rounded-xl p-4 text-white col-span-1 md:col-span-2 focus:border-indigo-500 focus:outline-none transition-colors" value={newGame.rawLink} onChange={e => setNewGame({...newGame, rawLink: e.target.value})} />
                  <input type="text" placeholder="Cover Image URL (Optional)" className="bg-black/50 border border-white/10 rounded-xl p-4 text-white col-span-1 md:col-span-2 focus:border-indigo-500 focus:outline-none transition-colors" value={newGame.coverImage} onChange={e => setNewGame({...newGame, coverImage: e.target.value})} />
                </div>
                <button 
                  onClick={handleAddGame} 
                  disabled={!newGame.name || !newGame.rawLink || !newGame.core}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-colors w-full justify-center md:w-auto"
                >
                  <Plus className="w-5 h-5"/> Add Game to Store
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold ml-2">Current Games</h3>
                {store.games.map(game => (
                  <div key={game.id} className="bg-white/5 p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-5">
                      {game.coverImage ? (
                        <img src={game.coverImage} alt="" className="w-20 h-20 object-cover rounded-xl shadow-md" />
                      ) : (
                        <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center text-white/30 text-xs text-center font-medium p-2">No Image</div>
                      )}
                      <div>
                        <h4 className="font-bold text-xl mb-1">{game.name}</h4>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-medium">{game.core}</span>
                          <span className="text-white/50">{game.size}</span>
                        </div>
                        <p className="text-xs text-white/30 mt-2 max-w-md truncate">{game.rawLink}</p>
                      </div>
                    </div>
                    <button onClick={() => store.deleteGame(game.id)} className="bg-red-500/10 text-red-400 p-4 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                      <Trash2 className="w-5 h-5"/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="space-y-4">
              {store.users.map(user => (
                <div key={user.email} className="bg-white/5 p-6 rounded-2xl flex items-center justify-between border border-white/10">
                  <div>
                    <h4 className="font-bold text-xl">{user.email}</h4>
                    <span className={`text-sm px-3 py-1 rounded-md mt-3 inline-block font-medium ${user.banned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {user.banned ? 'Banned' : 'Active'}
                    </span>
                  </div>
                  {user.email !== 'mdswampodsarkar@gmail.com' && (
                    <button 
                      onClick={() => store.toggleBanUser(user.email)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors ${user.banned ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}
                    >
                      {user.banned ? <ShieldAlert className="w-5 h-5"/> : <ShieldBan className="w-5 h-5"/>}
                      {user.banned ? 'Unban User' : 'Ban User'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'news' && (
            <div className="space-y-8">
              <div className="bg-white/5 p-8 rounded-3xl space-y-6 border border-white/10">
                <h3 className="text-2xl font-bold">Post Announcement</h3>
                <div className="grid grid-cols-1 gap-5">
                  <input type="text" placeholder="Announcement Title" className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 focus:outline-none transition-colors" value={newNews.title} onChange={e => setNewNews({...newNews, title: e.target.value})} />
                  <textarea placeholder="Message content..." className="bg-black/50 border border-white/10 rounded-xl p-4 text-white min-h-[120px] focus:border-indigo-500 focus:outline-none transition-colors" value={newNews.content} onChange={e => setNewNews({...newNews, content: e.target.value})} />
                </div>
                <button 
                  onClick={handleAddNews} 
                  disabled={!newNews.title || !newNews.content}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors w-full md:w-auto"
                >
                  <Plus className="w-5 h-5"/> Post Announcement
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold ml-2">Recent Announcements</h3>
                {store.news.map(item => (
                  <div key={item.id} className="bg-white/5 p-6 rounded-2xl flex items-start justify-between border border-white/5">
                    <div className="pr-4">
                      <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                      <p className="text-white/70 leading-relaxed">{item.content}</p>
                      <p className="text-xs text-white/40 mt-4 font-mono">{new Date(item.date).toLocaleString()}</p>
                    </div>
                    <button onClick={() => store.deleteNews(item.id)} className="bg-red-500/10 text-red-400 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-colors shrink-0">
                      <Trash2 className="w-5 h-5"/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
