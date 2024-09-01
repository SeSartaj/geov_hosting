import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { BASEMAP_OPTIONS } from '../constants';
import PropTypes from 'prop-types';
import { SettingsContext } from './SettingsContext';

// Create a new context for the map
const MapContext = createContext();

// create an enum for map modes
const MAP_MODES = {
  VIEW: 'view',
  ADD_MARKER: 'add_marker',
  ADD_PLOT: 'add_plot',
};

const MapProvider = ({ children }) => {
  const { settings } = useContext(SettingsContext);
  const [mode, setMode] = useState(MAP_MODES.VIEW);
  const [status, setStatus] = useState('idle');
  const [showDrawActionPopup, setShowDrawActionPopup] = useState(false);
  const [mapStyle, setMapStyle] = useState(
    BASEMAP_OPTIONS.find((o) => o.id === settings.basemap.id)?.url
  );
  const [isDetailActive, setIsDetailActive] = useState(false);

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
        status,
        setStatus,
        showDrawActionPopup,
        setShowDrawActionPopup,
        isDetailActive,
        setIsDetailActive,
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
