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
  const [showMarkers, setShowMarkers] = useState(true);

  const [unfilteredMarkers, setUnfilteredMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markerFilters, setMarkerFilters] = useState(EMPTY_FILTERS);

  const filterMarkers = (markers) => {
    setLoading(true);
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
    setLoading(false);

    return filteredMarkers;
  };

  const addNewMarker = (newMarker) => {
    console.log('newMarker from addNewMarker', newMarker);
    createMarker(newMarker).then((createdMarker) => {
      if (!createdMarker) return;
      console.log('createdMarker', createdMarker);
      setMarkers([...markers, transformMarker(createdMarker)]);
    });
  };

  const resetFilters = () => {
    setMarkerFilters(EMPTY_FILTERS);
  };

  useEffect(() => {
    console.log('markers', markers);
    setMarkers(filterMarkers(unfilteredMarkers));
  }, [markerFilters]);

  useEffect(() => {
    if (!showMarkers) return;
    const fetchData = async () => {
      setLoading(true);
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
  }, [showMarkers]);

  return {
    markers,
    showMarkers,
    setShowMarkers,
    setMarkers,
    addNewMarker,
    loading,
    markerFilters,
    setMarkerFilters,
    resetFilters,
  };
};
