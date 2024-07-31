import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { BASEMAP_OPTIONS } from '../constants';
import PropTypes from 'prop-types';
import { SettingsContext } from './SettingsContext';

// Create a new context for the map
const MapContext = createContext();

const MapProvider = ({ children }) => {
  const { settings } = useContext(SettingsContext);
  console.log('reseting mapStyle in mapprovider');
  const [mapStyle, setMapStyle] = useState(
    BASEMAP_OPTIONS.find((o) => o.id === settings.basemap.id)?.url
  );

  useEffect(() => {
    setMapStyle(BASEMAP_OPTIONS.find((o) => o.id === settings.basemap.id)?.url);
  }, [settings]);

  const [sources, setSources] = useState({});
  const mapRef = useRef(null);

  return (
    <MapContext.Provider
      value={{ mapStyle, setMapStyle, mapRef, sources, setSources }}
    >
      {children}
    </MapContext.Provider>
  );
};

MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MapContext, MapProvider };
