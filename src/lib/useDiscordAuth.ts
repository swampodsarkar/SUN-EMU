import { useState, useEffect } from 'react';

const DISCORD_CLIENT_ID = '1522128445314957453';

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
}

export function useDiscordAuth() {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check URL hash for access token (Implicit Grant)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
      // Clear hash to hide the token from the URL
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      localStorage.setItem('discord_token', accessToken);
      fetchUser(accessToken);
    } else {
      const storedToken = localStorage.getItem('discord_token');
      if (storedToken) {
        fetchUser(storedToken);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData.id,
          username: userData.username,
          avatar: userData.avatar,
        });
      } else {
        // Token might be invalid or expired
        localStorage.removeItem('discord_token');
      }
    } catch (error) {
      console.error('Failed to fetch Discord user', error);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    const redirectUri = encodeURIComponent(window.location.origin);
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=identify`;
    window.location.href = authUrl;
  };

  const logout = () => {
    localStorage.removeItem('discord_token');
    setUser(null);
  };

  return { user, loading, login, logout };
}
