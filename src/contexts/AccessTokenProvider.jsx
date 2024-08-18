import { createContext, useState, useEffect } from 'react';
import { fetchAccessToken } from '@/api/sentinalHubApi';

const clientId = import.meta.env.VITE_SENTINAL_HUB_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SENTINAL_HUB_CLIENT_SECRET;

export const AccessTokenContext = createContext(null);

export function AccessTokenProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);

  useEffect(() => {
    async function getToken() {
      const data = await fetchAccessToken(clientId, clientSecret);
      setAccessToken(data.access_token);
      setExpiresIn(Date.now() + data.expires_in * 1000);
    }

    // Fetch the token only if it's not already available
    if (!accessToken) {
      getToken();
    }

    // Set up the token refresh mechanism
    if (expiresIn) {
      const timeoutId = setTimeout(() => {
        getToken();
      }, expiresIn - Date.now() - 60000); // Refresh 1 minute before expiration

      return () => clearTimeout(timeoutId);
    }
  }, [accessToken, expiresIn]);

  return (
    <AccessTokenContext.Provider value={accessToken}>
      {children}
    </AccessTokenContext.Provider>
  );
}
