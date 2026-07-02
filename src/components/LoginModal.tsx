import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { X, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginModal({ onClose, onLoginSuccess }: { onClose: () => void, onLoginSuccess?: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useStore(state => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      if (onLoginSuccess) {
        onLoginSuccess(email);
      } else {
        onClose();
      }
    } else {
      setError('Invalid credentials or you are banned.');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-8 backdrop-blur-2xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-md p-10 flex flex-col relative text-white shadow-[0_0_80px_rgba(255,255,255,0.05)]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 bg-white/5 hover:bg-white/20 text-white p-3 rounded-full transition-all">
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-white/50 mt-2">Sign in to your PS5 Network account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm">{error}</div>}
          
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-gray-200 py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
}
