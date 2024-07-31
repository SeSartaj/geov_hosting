import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMarkers } from '../hooks/useMarkers';

// Create a new context for the map
const MarkersContext = createContext();

const MarkersProvider = ({ children }) => {
  const [clickedMarker, setClickedMarker] = useState(null);
  const { markers, loading, markerFilters, setMarkerFilters, resetFilters } =
    useMarkers();

  useEffect(() => {
    console.log('markers have changed, updating the context', markers, loading);
  }, [markers, loading]);

  return (
    <MarkersContext.Provider
      value={{
        markersData: markers,
        markerFilters,
        setMarkerFilters,
        clickedMarker,
        setClickedMarker,
        resetFilters,
      }}
    >
      {children}
    </MarkersContext.Provider>
  );
};

MarkersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MarkersContext, MarkersProvider };
