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
import useMapStore from '@/stores/mapStore';
import { VIEW_MODES } from '@/stores/mapStore';

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
  const setViewMode = useMapStore((state) => state.setViewMode);

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
      draw.deleteAll();
      setMode('view');
      setViewMode(VIEW_MODES.NORMAL);
    },
    [draw, mode]
  );

  const handleEditPlot = (plot) => {
    console.log('plot', plot);
    console.log('draw is ', draw);
    if (map) {
      const draw = drawRef.current;
      handleFlyToPlot(plot?.options.geometry.coordinates);
      setViewMode(VIEW_MODES.EDIT_PLOT);
      if (draw) {
        console.log('draw exsit');
        // remove anything drawn before
        draw.deleteAll();
        // add the plot to draw layer
        draw.add(plot?.options);
        console.log('setEditingPlot(plot);', plot);
        setEditingPlot(plot);
        return plot;
      }
    }
  };

  return (
    <PlotContext.Provider
      value={{
        loading,
        plots,
        addNewPlot,
        clickedPlot,
        handlePlotUpdate,
        setClickedPlot,
        showPlots,
        setShowPlots: handleShowPlots,
        handleFlyToPlot,
        handleEditPlot,
        weeksBefore,
        setWeeksBefore,
        editingPlot,
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
