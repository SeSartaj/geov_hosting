import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  const [mode, setMode] = useState(MAP_MODES.VIEW);
  const [status, setStatus] = useState('idle');
  const [showDrawActionPopup, setShowDrawActionPopup] = useState(false);

  const [isDetailActive, setIsDetailActive] = useState(false);

  const [sources, setSources] = useState({});
  const mapRef = useRef(null);
  const drawRef = useRef(null);

  const contextValue = useMemo(
    () => ({
      mapRef,
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
    }),
    [sources, mode, status, showDrawActionPopup, isDetailActive]
  );

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  );
};

MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MapContext, MapProvider };
