import { createPlot, getPlots } from '@/api/plotApi';
import { getNDVILayerUrl } from '@/utils/getNDVILayerUrl';
import isEmptyObject from '@/utils/isEmptyObject';
import { bbox } from '@turf/turf';
import { useCallback, useEffect, useState } from 'react';
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
      id: 'lmvkmsdmweioldmfsk',
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
      id: 'idskkaldmlvksdkds',
    },
  },
  {
    id: 'kdkjsksksdladfdkxm',
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
      id: 'kdkjsksksdladfdkxm',
    },
  },
  {
    id: ',mxcvmksdnfsjnfasdfas',
    type: 'Feature',
    properties: {
      id: 'mxcvmksdnfsjnfasdfas',
      name: 'plot 1 3',
      description: 'ksdkf',
    },
    geometry: {
      type: 'Polygon',
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
    },
  },
  {
    id: 'd0a46521eead375d1f68b1c',
    type: 'Feature',
    properties: {
      id: 'd0a46521eead375d1f68b1c',
      name: 'plot 23`ksd',
      description: 'ksd',
    },
    geometry: {
      coordinates: [
        [
          [69.19074392395714, 34.55366362657435],
          [69.19127770236099, 34.55366609768588],
          [69.19129320637583, 34.55356394534637],
          [69.19151026259922, 34.55355117629429],
          [69.19156194265193, 34.55270415817802],
          [69.19092627799861, 34.55273820932368],
          [69.1909159419881, 34.552878670153774],
          [69.1907195577858, 34.552891439308254],
          [69.19074392395714, 34.55366362657435],
        ],
      ],
      type: 'Polygon',
    },
  },
];

export const usePlots = () => {
  const [plots, setPlots] = useState(
    DUMMY_PLOTS.forEach((p) => {
      p.properties.bbox = bbox(p);
      p.properties.ndviUrl = getNDVILayerUrl(p);
    })
  );
  const [unfilteredPlots, setUnfilteredPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plotFilters, setPlotFilters] = useState(EMPTY_FILTERS);

  const resetFilters = () => {
    setPlotFilters(EMPTY_FILTERS);
    ``;
  };

  const filterPlots = (unfilteredPlots) => {
    return unfilteredPlots;
  };

  const addNewPlot = (newPlot) => {
    console.log('new plot', newPlot);
    // newPlot.properties.ndviUrl = getNDVILayerUrl(newPlot);
    createPlot(newPlot).then((createdPlot) => {
      if (!createdPlot) return;
      console.log('created Plot');
      setPlots((prev) => [...prev, createdPlot.options]);
    });
  };

  const getPlotsList = useCallback(() => {
    getPlots().then((plots) => {
      setPlots(
        plots
          .map((p) => {
            if (isEmptyObject(p.options)) return null;
            const plot = p.options;
            console.log('bbox', plot);
            plot.properties.bbox = bbox(plot);
            plot.properties.ndviUrl = getNDVILayerUrl(plot);
            plot.properties.id = plot.id;
            return plot;
          })
          .filter((plot) => plot !== null) // Filter out null plots
      );
    });
  }, []);

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
    console.log('plots are ', plots);
    setPlots(filterPlots(unfilteredPlots));
  }, [plotFilters]);

  useEffect(() => {
    getPlotsList(plotFilters);
  }, [plotFilters, getPlotsList]);

  console.log('plots', plots);

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
