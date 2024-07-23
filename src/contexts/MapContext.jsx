import { createContext, useRef, useState } from 'react';
import { DEFAULT_BASEMAP } from '../constants';
import PropTypes from 'prop-types';

// Create a new context for the map
const MapContext = createContext();

const MapProvider = ({ children }) => {
  const [mapStyle, setMapStyle] = useState(DEFAULT_BASEMAP);
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
