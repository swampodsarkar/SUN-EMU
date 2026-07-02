import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithCustomToken, signOut } from 'firebase/auth';

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  email?: string;
  firebase_token?: string;
}

// Utility to parse cookies safely
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function useDiscordAuth() {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have the session cookie from our server
    const sessionCookieStr = getCookie('discord_session');
    
    if (sessionCookieStr) {
      try {
        const decodedStr = decodeURIComponent(sessionCookieStr);
        const sessionData = JSON.parse(decodedStr);
        setUser(sessionData);
        
        // If we received a Firebase custom token, sign in with it!
        if (sessionData.firebase_token) {
           signInWithCustomToken(auth, sessionData.firebase_token)
             .catch((error) => console.error("Firebase auth error:", error));
        }
      } catch (e) {
        console.error("Failed to parse session cookie", e);
      }
    }
    
    setLoading(false);
  }, []);

  const login = () => {
    // Redirect to our secure backend route which initiates OAuth
    window.location.href = '/auth/discord/login';
  };

  const logout = () => {
    clearCookie('discord_session');
    setUser(null);
    signOut(auth).catch(console.error);
  };

  return { user, loading, login, logout };
}
