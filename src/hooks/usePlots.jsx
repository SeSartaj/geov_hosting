import { useEffect, useState } from 'react';
const EMPTY_FILTERS = {};

const DUMMY_PLOTS = [
  {
    id: 'lmvkmsdmweioldmfsk',
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
    id: 'idskkaldmlvksdkds',
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
    id: 'kdkjsksksdladfd',
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
  {
    id: '195998dfd94a7cf8c98320177b9266ab',
    type: 'Feature',
    properties: {
      name: 'plot 1 3',
      description: 'ksdkf',
    },
    geometry: {
      coordinates: [
        [
          [-72.30484165371566, -40.08026576811746],
          [-72.29506559590199, -40.07979240065652],
          [-72.2926107806077, -40.083089622627874],
          [-72.30806030453363, -40.085650691709894],
          [-72.30788864315659, -40.07800003272502],
          [-72.30484165371566, -40.08026576811746],
        ],
      ],
      type: 'Polygon',
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

  const updatePlot = (updatedPlot) => {
    console.log('updating plot', updatedPlot);
    setPlots((prev) => {
      const index = prev.findIndex((plot) => plot.id === updatedPlot.id);
      if (index === -1) {
        return prev;
      }

      const newPlots = [...prev];
      newPlots[index] = updatedPlot;
      return newPlots;
    });
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
    updatePlot,
    setPlotFilters,
    resetFilters,
  };
};
