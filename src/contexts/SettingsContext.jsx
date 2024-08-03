import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Create a new context for the map
const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    basemap: {
      id: 'basic',
      zoom: 6,
      longitude: 69.2084,
      latitude: 34.5553,
    },
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SettingsContext, SettingsProvider };
