import { useEffect, useState } from 'react';
import { createMarker, getMarkers } from '../api/markerApi';
import { transformMarker } from '../utils/transformMarker';
const EMPTY_FILTERS = {
  type: '',
  paw_status: '',
  farm_id: '',
  batteryLevel: null,
};
export const useMarkers = () => {
  const [markers, setMarkers] = useState([]);
  const [unfilteredMarkers, setUnfilteredMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markerFilters, setMarkerFilters] = useState(EMPTY_FILTERS);

  const filterMarkers = (markers) => {
    console.log('filtering', markers);
    let filteredMarkers = markers;
    if (markerFilters.type) {
      filteredMarkers = filteredMarkers.filter(
        (m) => m.type === markerFilters.type
      );
    }

    if (markerFilters.farm_id) {
      filteredMarkers = filteredMarkers.filter(
        (m) => m.farm?.id === Number(markerFilters.farm_id)
      );
    }

    if (markerFilters.paw_status) {
      filteredMarkers = filteredMarkers.filter(
        (m) => m.paw_status === markerFilters.paw_status
      );
    }
    console.log('after filter', filteredMarkers);

    return filteredMarkers;
  };

  const addNewMarker = (newMarker) => {
    createMarker(newMarker).then((createdMarker) => {
      console.log('created marker', createdMarker);
      setMarkers([...markers, transformMarker(createdMarker)]);
    });
  };

  const resetFilters = () => {
    setMarkerFilters(EMPTY_FILTERS);
  };

  useEffect(() => {
    setMarkers(filterMarkers(unfilteredMarkers));
  }, [markerFilters]);

  useEffect(() => {
    console.log('fetching marker data');
    const fetchData = async () => {
      try {
        const data = await getMarkers();
        // modify the markers
        const modifiedData = data
          .map((marker) => transformMarker(marker))
          .filter((marker) => marker !== null);
        setUnfilteredMarkers(modifiedData);
        setMarkers(modifiedData);
      } catch (error) {
        console.log('error fetching markers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    markers,
    setMarkers,
    addNewMarker,
    loading,
    markerFilters,
    setMarkerFilters,
    resetFilters,
  };
};
