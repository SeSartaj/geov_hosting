import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMarkers } from '../hooks/useMarkers';

// Create a new context for the map
const MarkersContext = createContext();

const MarkersProvider = ({ children }) => {
  const [clickedMarker, setClickedMarker] = useState(null);
  const {
    markers,
    setMarkers,
    showMarkers,
    setShowMarkers,
    addNewMarker,
    loading,
    markerFilters,
    setMarkerFilters,
    resetFilters,
    handleMarkerUpdate
  } = useMarkers();

  const handleShowMarkerChange = (value) => {
    setClickedMarker(null);
    setShowMarkers(value);
  };

  return (
    <MarkersContext.Provider
      value={{
        // replace markersData with markers
        markersData: markers,
        loading,
        markers,
        setMarkers,
        addNewMarker,
        markerFilters,
        setMarkerFilters,
        clickedMarker,
        setClickedMarker,
        resetFilters,
        showMarkers,
        setShowMarkers: handleShowMarkerChange,
        handleMarkerUpdate,
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
