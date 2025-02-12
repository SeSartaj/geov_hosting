import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMarkers } from '../hooks/useMarkers';

// Create a new context for the map
const MarkersContext = createContext();

const MarkersProvider = ({ children }) => {
  const {
    markers,
    setMarkers,
    showMarkers,
    clickedMarker,
    setClickedMarker,
    handleShowMarkerChange,
    addNewMarker,
    loading,
    markerFilters,
    setMarkerFilters,
    resetFilters,
    handleMarkerUpdate,
    handleDeleteMarker,
    unfilteredMarkers,
  } = useMarkers();

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
        resetFilters,
        showMarkers,
        setShowMarkers: handleShowMarkerChange,
        clickedMarker,
        setClickedMarker,
        handleMarkerUpdate,
        handleDeleteMarker,
        unfilteredMarkers,
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
