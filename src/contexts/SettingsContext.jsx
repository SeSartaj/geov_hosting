import React, { useState, useEffect, useContext, createContext } from 'react';

import { usePrefersDarkMode } from '@/hooks/usePrefersDarkMode';
import { getMapSettings } from '@/api/mapApi';

// Create separate contexts
export const SettingsContext = createContext();
export const DarkModeContext = createContext();
export const InitialViewContext = createContext();

export const useSettings = () => useContext(SettingsContext);
export const useDarkMode = () => useContext(DarkModeContext);
export const useInitialView = () => useContext(InitialViewContext);

export const SettingsProvider = ({ children }) => {
  // Individual state hooks for each value
  const [settings, setSettings] = useState({
    basemap: {
      id: 'basic',
      zoom: 6,
      longitude: -40.153113,
      latitude: -35.9503019,
    },
  });
  const [initialViewState, setInitialViewState] = useState(null);

  const isDarkMode = usePrefersDarkMode();

  useEffect(() => {
    getMapSettings().then((data) => {
      if (!data) {
        throw new Error(
          'Could not loading map intial View settings from the backend. please try again later, or contact your admin'
        );
      }
      console.log('data from iii', data);
      setInitialViewState({
        latitude: data.options.center.lat,
        longitude: data.options.center.lng,
        zoom: data.options.zoom,
      });
      setSettings((prevSettings) => ({ ...prevSettings, mapId: data.id }));
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <DarkModeContext.Provider value={isDarkMode}>
        <InitialViewContext.Provider value={initialViewState}>
          {children}
        </InitialViewContext.Provider>
      </DarkModeContext.Provider>
    </SettingsContext.Provider>
  );
};
