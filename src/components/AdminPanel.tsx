import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { X, Plus, Trash2, ShieldBan, ShieldAlert } from 'lucide-react';

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const store = useStore();
  const [tab, setTab] = useState<'games' | 'users' | 'news'>('games');

  const [newGame, setNewGame] = useState({ name: '', size: '', rawLink: '', coverImage: '' });
  const [newNews, setNewNews] = useState({ title: '', content: '' });

  const handleAddGame = () => {
    if (newGame.name && newGame.rawLink) {
      store.addGame(newGame);
      setNewGame({ name: '', size: '', rawLink: '', coverImage: '' });
    }
  };

  const handleAddNews = () => {
    if (newNews.title && newNews.content) {
      store.addNews(newNews);
      setNewNews({ title: '', content: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 flex items-center justify-center p-8 backdrop-blur-xl">
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl relative text-white">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-red-500/90 text-white p-3 rounded-full transition-all">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8 border-b border-white/10 shrink-0">
          <h2 className="text-3xl font-bold">Admin Panel</h2>
          <div className="flex gap-4 mt-6">
            <button onClick={() => setTab('games')} className={`px-6 py-2 rounded-full font-medium ${tab === 'games' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}>Games</button>
            <button onClick={() => setTab('users')} className={`px-6 py-2 rounded-full font-medium ${tab === 'users' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}>Users</button>
            <button onClick={() => setTab('news')} className={`px-6 py-2 rounded-full font-medium ${tab === 'news' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}>News</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {tab === 'games' && (
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-2xl space-y-4 border border-white/10">
                <h3 className="text-xl font-semibold">Add New Game</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Name" className="bg-black/50 border border-white/10 rounded-xl p-3 text-white" value={newGame.name} onChange={e => setNewGame({...newGame, name: e.target.value})} />
                  <input type="text" placeholder="Size (e.g. 50MB)" className="bg-black/50 border border-white/10 rounded-xl p-3 text-white" value={newGame.size} onChange={e => setNewGame({...newGame, size: e.target.value})} />
                  <input type="text" placeholder="Raw Link" className="bg-black/50 border border-white/10 rounded-xl p-3 text-white col-span-2" value={newGame.rawLink} onChange={e => setNewGame({...newGame, rawLink: e.target.value})} />
                  <input type="text" placeholder="Cover Image URL" className="bg-black/50 border border-white/10 rounded-xl p-3 text-white col-span-2" value={newGame.coverImage} onChange={e => setNewGame({...newGame, coverImage: e.target.value})} />
                </div>
                <button onClick={handleAddGame} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5"/> Add Game</button>
              </div>

              <div className="space-y-3">
                {store.games.map(game => (
                  <div key={game.id} className="bg-white/5 p-4 rounded-xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-4">
                      {game.coverImage && <img src={game.coverImage} alt="" className="w-16 h-16 object-cover rounded-lg" />}
                      <div>
                        <h4 className="font-bold text-lg">{game.name}</h4>
                        <p className="text-sm text-white/50">{game.size} • {game.rawLink}</p>
                      </div>
                    </div>
                    <button onClick={() => store.deleteGame(game.id)} className="bg-red-500/20 text-red-400 p-3 rounded-xl hover:bg-red-500/40"><Trash2 className="w-5 h-5"/></button>
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
                    <span className={`text-sm px-2 py-1 rounded-md mt-2 inline-block ${user.banned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {user.banned ? 'Banned' : 'Active'}
                    </span>
                  </div>
                  {user.email !== 'mdswampodsakrar@gmail.com' && (
                    <button 
                      onClick={() => store.toggleBanUser(user.email)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${user.banned ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}
                    >
                      {user.banned ? <ShieldAlert className="w-5 h-5"/> : <ShieldBan className="w-5 h-5"/>}
                      {user.banned ? 'Unban' : 'Ban'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'news' && (
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-2xl space-y-4 border border-white/10">
                <h3 className="text-xl font-semibold">Add News</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input type="text" placeholder="Title" className="bg-black/50 border border-white/10 rounded-xl p-3 text-white" value={newNews.title} onChange={e => setNewNews({...newNews, title: e.target.value})} />
                  <textarea placeholder="Content" className="bg-black/50 border border-white/10 rounded-xl p-3 text-white min-h-[100px]" value={newNews.content} onChange={e => setNewNews({...newNews, content: e.target.value})} />
                </div>
                <button onClick={handleAddNews} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5"/> Add News</button>
              </div>

              <div className="space-y-3">
                {store.news.map(item => (
                  <div key={item.id} className="bg-white/5 p-4 rounded-xl flex items-center justify-between border border-white/5">
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-sm text-white/50">{item.content}</p>
                      <p className="text-xs text-white/30 mt-2">{new Date(item.date).toLocaleString()}</p>
                    </div>
                    <button onClick={() => store.deleteNews(item.id)} className="bg-red-500/20 text-red-400 p-3 rounded-xl hover:bg-red-500/40"><Trash2 className="w-5 h-5"/></button>
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
