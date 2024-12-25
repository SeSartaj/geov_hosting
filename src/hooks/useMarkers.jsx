import { useEffect, useState } from 'react';
import {
  createMarker,
  deleteMarker,
  getMarkers,
  updateMarker,
} from '../api/markerApi';
import { transformMarker } from '../utils/transformMarker';
const EMPTY_FILTERS = {
  type: '',
  paw_status: '',
  farm_id: '',
  batteryLevel: null,
};
export const useMarkers = () => {
  const [markers, setMarkers] = useState([]);
  const [showMarkers, setShowMarkers] = useState(true);

  const [unfilteredMarkers, setUnfilteredMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markerFilters, setMarkerFilters] = useState(EMPTY_FILTERS);

  const filterMarkers = (markers, filters = markerFilters) => {
    console.log('markers are ', markers);

    setLoading(true);
    let filteredMarkers = markers;

    if (filters.type) {
      filteredMarkers = filteredMarkers.filter((m) => m.type === filters.type);
    }

    if (filters.farm_id) {
      filteredMarkers = filteredMarkers.filter(
        (m) => m.farm?.id === Number(filters.farm_id)
      );
    }

    if (filters.paw_status) {
      filteredMarkers = filteredMarkers.filter(
        (m) => m.paw_status === filters.paw_status
      );
    }
    setLoading(false);
    return filteredMarkers;
  };

  const handleMarkerUpdate = (data) => {
    return updateMarker(data).then((updatedMarker) => {
      if (!updatedMarker) return;
      const updatedMarkers = markers.map((marker) =>
        marker.id === updatedMarker.id ? updatedMarker : marker
      );
      setMarkers(updatedMarkers);
    });
  };

  const handleDeleteMarker = (markerId) => {
    return deleteMarker(markerId).then(() => {
      const updatedMarkers = markers.filter((marker) => marker.id !== markerId);
      setMarkers(updatedMarkers);
    });
  };

  const addNewMarker = (newMarker) => {
    console.log('newMarker from addNewMarker', newMarker);
    createMarker(newMarker).then((createdMarker) => {
      if (!createdMarker) return;
      setMarkers([...markers, createdMarker]);
    });
  };

  const handleFilterChange = (filters) => {
    setMarkerFilters(filters);
    setMarkers(filterMarkers(unfilteredMarkers, filters));
  };

  const resetFilters = () => {
    handleFilterChange(EMPTY_FILTERS);
  };

  useEffect(() => {
    if (!showMarkers) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getMarkers();

        console.log('data in getMarkers', data);
        // modify the markers
        const modifiedData = data
          .map((marker) => transformMarker(marker))
          .filter((marker) => marker !== null);

        console.log('modifiedData', modifiedData);
        setUnfilteredMarkers(modifiedData);
        setMarkers(filterMarkers(modifiedData));
      } catch (error) {
        console.log('error fetching markers', error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showMarkers]);

  return {
    markers,
    showMarkers,
    setShowMarkers,
    setMarkers,
    addNewMarker,
    loading,
    markerFilters,
    setMarkerFilters: handleFilterChange,
    resetFilters,
    handleMarkerUpdate,
    handleDeleteMarker,
  };
};
