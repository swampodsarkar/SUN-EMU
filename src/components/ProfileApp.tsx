import React, { useEffect, useState } from 'react';
import { useDiscordAuth } from '../lib/useDiscordAuth';
import { LogIn, LogOut, User, Save, RefreshCw } from 'lucide-react';
import { ref, set, get } from 'firebase/database';
import { db } from '../lib/firebase';

export default function ProfileApp() {
  const { user, loading, login, logout } = useDiscordAuth();
  const [coins, setCoins] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    setIsLoadingData(true);
    try {
      const userRef = ref(db, `users/${user.id}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.coins !== undefined) {
          setCoins(data.coins);
        }
      }
    } catch (error) {
      console.error("Error loading user data from Firebase:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const saveUserData = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const userRef = ref(db, `users/${user.id}`);
      await set(userRef, {
        username: user.username,
        coins: coins,
        lastUpdated: Date.now()
      });
      alert("Data saved to cloud successfully!");
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to save data. Please check Firebase Rules.");
    } finally {
      setIsSaving(false);
    }
  };

  const addCoins = () => {
    setCoins(prev => prev + 10);
  };

  if (loading) {
    return (
      <div className="h-full w-full bg-[#020617] text-white flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#020617] text-white p-8 overflow-auto font-sans">
      <div className="max-w-md mx-auto bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-400" />
          Cloud Profile
        </h2>

        {!user ? (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-6">Login with Discord to save your emulator game data and coins to the cloud.</p>
            <button 
              onClick={login}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 w-full"
            >
              <LogIn className="w-5 h-5" />
              Login with Discord
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              {user.avatar ? (
                <img 
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full border-2 border-indigo-500"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center border-2 border-indigo-500">
                  <User className="w-8 h-8 text-indigo-400" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{user.username}</h3>
                <p className="text-slate-400 text-xs font-mono">ID: {user.id}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Coins</p>
                {isLoadingData ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
                ) : (
                  <p className="text-3xl font-bold text-amber-400">{coins}</p>
                )}
              </div>
              <button 
                onClick={addCoins}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
              >
                + Earn Coins
              </button>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button 
                onClick={saveUserData}
                disabled={isSaving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save to Cloud
              </button>
              <button 
                onClick={logout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
