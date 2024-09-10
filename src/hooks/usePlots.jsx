import { createPlot, deletePlot, getPlots, updatePlot } from '@/api/plotApi';
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
  const [loading, setLoading] = useState(false);
  const [plotFilters, setPlotFilters] = useState(EMPTY_FILTERS);

  const resetFilters = () => {
    setPlotFilters(EMPTY_FILTERS);
    ``;
  };

  const filterPlots = (unfilteredPlots) => {
    return unfilteredPlots;
  };

  const addNewPlot = (newPlot) => {
    console.log('inside addNewPlot');
    // newPlot.properties.ndviUrl = getNDVILayerUrl(newPlot);
    return createPlot(newPlot).then((createdPlot) => {
      if (!createdPlot) return;

      setPlots((prev) => [...prev, createdPlot]);
    });
  };

  const handleDeletePlot = (plot) => {
    setLoading(true);
    deletePlot(plot.id)
      .then(() => {
        // remove the plot from plots
        const newPlotsList = [...plots];
        setPlots(newPlotsList.filter((p) => p.id !== plot.id));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  const getPlotsList = useCallback(() => {
    setLoading(true);
    getPlots()
      .then((p) => {
        setPlots(
          p
            .map((plot) => {
              if (isEmptyObject(plot?.options)) return null;
              plot.options.properties.id = plot?.options?.id;
              plot.options.properties.name = plot?.name;
              return plot;
            })
            .filter((p) => p !== null)
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handlePlotUpdate = (updatedPlot) => {
    console.log('updating plot', updatedPlot);
    // locally change the plot location
    setPlots((prev) => {
      const updatedPlots = prev.map((plot) => {
        if (
          plot?.options?.properties.id === updatedPlot?.options?.properties?.id
        ) {
          return updatedPlot;
        }
        return plot;
      });

      return updatedPlots;
    });

    updatePlot(updatedPlot).then(() => {
      getPlotsList();
    });
  };

  //
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
    handlePlotUpdate,
    setPlotFilters,
    resetFilters,
    handleDeletePlot,
  };
};
