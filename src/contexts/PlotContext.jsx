import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { usePlots } from '../hooks/usePlots';
import { MapContext } from './MapContext';
import { LngLatBounds } from 'maplibre-gl';
import { deletePlot } from '@/api/plotApi';

// Create a new context for the map
const PlotContext = createContext();

const PlotProvider = ({ children }) => {
  const { mapRef, drawRef, mode, setMode } = useContext(MapContext);
  const [editingPlot, setEditingPlot] = useState(null);
  const [clickedPlot, setClickedPlot] = useState(null);
  const { plots, addNewPlot, handlePlotUpdate, handleDeletePlot, loading } =
    usePlots();
  const [showPlots, setShowPlots] = useState(true);
  const [weeksBefore, setWeeksBefore] = useState(0);
  const [showNdviLayer, setShowNdviLayer] = useState(false);

  const map = mapRef?.current?.getMap();
  const draw = drawRef?.current;

  const handleShowPlots = (value) => {
    setClickedPlot(null);
    setShowPlots(value);
  };

  const toggleNDVILayersVisibility = (visibility) => {
    console.log('runnign toggleNDVILayersVisibility', visibility);
    if (typeof visibility === 'string') {
      setNDVILayersVisibility(visibility);
      setShowNdviLayer(visibility === 'visible');
    } else if (typeof visibility === 'boolean') {
      const s = visibility ? 'visible' : 'none';
      setNDVILayersVisibility(s);
      setShowNdviLayer(visibility);
    } else {
      setNDVILayersVisibility(showNdviLayer ? 'none' : 'visible');
      setShowNdviLayer(!showNdviLayer);
    }
  };

  const setNDVILayersVisibility = useCallback(
    (visibility) => {
      map?.getStyle()?.layers?.forEach((layer) => {
        if (layer.id.startsWith('ndviImageLayer')) {
          map.setLayoutProperty(layer.id, 'visibility', visibility);
        }
      });
    },
    [map]
  );

  const changeNdviLayerOpacity = useCallback(
    (opacity) => {
      map?.getStyle()?.layers?.forEach((layer) => {
        if (layer.id.startsWith('ndviImageLayer')) {
          map.setPaintProperty(layer.id, 'raster-opacity', opacity / 100);
        }
      });
    },
    [map]
  );

  const handleFlyToPlot = (coordinates) => {
    const map = mapRef.current.getMap();
    if (map) {
      const bounds = new LngLatBounds();

      coordinates.forEach((polygon) => {
        polygon.forEach((coord) => {
          bounds.extend([coord[0], coord[1]]);
        });
      });

      map.fitBounds(bounds, {
        padding: 150,
        essential: true,
      });
    }
  };

  const handleDrawComplete = useCallback(
    (event) => {
      console.log('mode', event.mode);
      // delete draws after completion
      console.log('event', event);
      if (event.mode === 'simple_select' && mode === 'editing-plot') {
        draw.deleteAll();
        setMode('view');
      }
    },
    [draw, mode]
  );

  const handleEditPlot = (plot) => {
    console.log('plot', plot);
    if (map) {
      const draw = drawRef.current;
      handleFlyToPlot(plot?.options.geometry.coordinates);
      if (draw) {
        setMode('editing-plot');
        // remove anything drawn before
        draw.deleteAll();
        // add the plot to draw layer
        draw.add(plot?.options);
        setEditingPlot(plot);
      }
    }
  };

  const handleDrawChange = useCallback(
    (event) => {
      // if editing a plot
      console.log('handling draw change', event);
      // Update the plot when it is edited
      if (event.features && event.features.length > 0) {
        handlePlotUpdate({ ...editingPlot, options: event.features[0] });
      }
    },
    [editingPlot, handlePlotUpdate]
  );

  useEffect(() => {
    if (map && draw) {
      // Listen to draw.update event for edits
      map.on('draw.update', handleDrawChange);
      map.on('draw.modechange', handleDrawComplete);

      // Clean up the event listeners when the component unmounts
      return () => {
        map.off('draw.update', handleDrawChange);
        map.off('draw.modechange', handleDrawComplete);
      };
    }
  }, [map, draw, handleDrawChange, handleDrawComplete]);

  return (
    <PlotContext.Provider
      value={{
        loading,
        plots,
        addNewPlot,
        clickedPlot,
        setClickedPlot,
        showPlots,
        setShowPlots: handleShowPlots,
        handleFlyToPlot,
        handleEditPlot,
        handleDrawChange,
        weeksBefore,
        setWeeksBefore,
        showNdviLayer,
        setNDVILayersVisibility,
        toggleNDVILayersVisibility,
        changeNdviLayerOpacity,
        handleDeletePlot,
      }}
    >
      {children}
    </PlotContext.Provider>
  );
};

PlotProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { PlotContext, PlotProvider };
