import { createContext, useState, useEffect } from 'react';
import { fetchAccessToken } from '@/api/sentinalHubApi';

const clientId = import.meta.env.VITE_SENTINAL_HUB_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SENTINAL_HUB_CLIENT_SECRET;

export const AccessTokenContext = createContext(null);

export function AccessTokenProvider({ children }) {
  const [accessToken, setAccessToken] = useState(undefined);
  const [expiresIn, setExpiresIn] = useState(null);

  useEffect(() => {
    async function getToken() {
      try {
        const data = await fetchAccessToken(clientId, clientSecret);

        setAccessToken(data.access_token);
        setExpiresIn(Date.now() + data.expires_in * 1000);
      } catch (error) {
        console.error('Failed to fetch access token', error);
        setAccessToken(null);
        setExpiresIn(null);
      }
    }

    if (!accessToken) {
      getToken();
    }

    if (expiresIn) {
      const timeoutId = setTimeout(() => {
        getToken();
      }, expiresIn - Date.now() - 60000);

      return () => clearTimeout(timeoutId);
    }
  }, [accessToken, expiresIn]);

  return (
    <AccessTokenContext.Provider value={accessToken}>
      {children}
    </AccessTokenContext.Provider>
  );
}
