import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { BASEMAP_OPTIONS } from '../constants';
import PropTypes from 'prop-types';
import { SettingsContext } from './SettingsContext';

// Create a new context for the map
const MapContext = createContext();

const MapProvider = ({ children }) => {
  const { settings } = useContext(SettingsContext);
  const [mode, setMode] = useState('view');
  const [showDrawActionPopup, setShowDrawActionPopup] = useState(false);
  const [mapStyle, setMapStyle] = useState(
    BASEMAP_OPTIONS.find((o) => o.id === settings.basemap.id)?.url
  );

  useEffect(() => {
    setMapStyle(BASEMAP_OPTIONS.find((o) => o.id === settings.basemap.id)?.url);
  }, [settings]);

  const [sources, setSources] = useState({});
  const mapRef = useRef(null);
  const drawRef = useRef(null);

  const mapInstance = mapRef.current?.getMap();

  return (
    <MapContext.Provider
      value={{
        mapStyle,
        setMapStyle,
        mapRef,
        mapInstance,
        drawRef,
        sources,
        setSources,
        mode,
        setMode,
        showDrawActionPopup,
        setShowDrawActionPopup,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MapContext, MapProvider };
