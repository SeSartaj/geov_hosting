import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getMapSettings } from '@/api/mapApi';

// Create a new context for the map
const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    basemap: {
      id: 'basic',
      zoom: 6,
      longitude: -40.153113,
      latitude: -35.9503019,
    },
  });

  const [initialViewState, setInitialViewState] = useState(null);

  useEffect(() => {
    getMapSettings().then((data) => {
      console.log('mapsettings', data);
      console.log('setting mmap settings');
      setInitialViewState({
        latitude: data.options.center.lat,
        longitude: data.options.center.lng,
        zoom: data.options.zoom,
      });
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, setSettings, initialViewState }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SettingsContext, SettingsProvider };
