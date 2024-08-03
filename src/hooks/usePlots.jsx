import { useEffect, useState } from 'react';
import { getMarkers } from '../api/markerApi';
import { transformMarker } from '../utils/transformMarker';
const EMPTY_FILTERS = {};

const DUMMY_PLOTS = [
  {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [69.2084, 34.5553],
          [69.209, 34.5553],
          [69.209, 34.556],
          [69.2084, 34.556],
          [69.2084, 34.5553],
        ],
      ],
    },
    properties: {
      name: 'Plot 1',
      farm: 'Farm 1',
    },
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [69.2094, 34.5553],
          [69.21, 34.5553],
          [69.21, 34.556],
          [69.2094, 34.556],
          [69.2094, 34.5553],
        ],
      ],
    },
    properties: {
      name: 'Plot 2',
      farm: 'Farm 1',
    },
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [69.2104, 34.5553],
          [69.211, 34.5553],
          [69.211, 34.556],
          [69.2104, 34.556],
          [69.2104, 34.5553],
        ],
      ],
    },
    properties: {
      name: 'Plot 3',
      farm: 'Farm 1',
    },
  },
];

export const usePlots = () => {
  const [plots, setPlots] = useState(DUMMY_PLOTS);
  const [unfilteredPlots, setUnfilteredPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plotFilters, setPlotFilters] = useState(EMPTY_FILTERS);

  const resetFilters = () => {
    setPlotFilters(EMPTY_FILTERS);
  };

  const filterPlots = (unfilteredPlots) => {
    return unfilteredPlots;
  };

  const addNewPlot = (newPlot) => {
    setPlots((prev) => [...prev, newPlot]);
  };

  useEffect(() => {
    setPlots(filterPlots(unfilteredPlots));
  }, [plotFilters]);

  useEffect(() => {
    console.log('fetching plot data');
    const fetchData = async () => {
      setUnfilteredPlots(DUMMY_PLOTS);
      setPlots(DUMMY_PLOTS);
    };

    fetchData();
  }, []);

  return {
    plots,
    loading,
    plotFilters,
    addNewPlot,
    setPlotFilters,
    resetFilters,
  };
};
