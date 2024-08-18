import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { usePlots } from '../hooks/usePlots';
import { MapContext } from './MapContext';
import { LngLatBounds } from 'maplibre-gl';

// Create a new context for the map
const PlotContext = createContext();

const PlotProvider = ({ children }) => {
  const { mapRef, drawRef, mode, setMode } = useContext(MapContext);
  const [editingPlot, setEditingPlot] = useState(null);
  const [clickedPlot, setClickedPlot] = useState(null);
  const { plots, loading, addNewPlot, updatePlot } = usePlots();
  const [showPlots, setShowPlots] = useState(true);
  const [weeksBefore, setWeeksBefore] = useState(0);
  const [ndviLoading, setNdviLoading] = useState([]);

  const map = mapRef?.current?.getMap();
  const draw = drawRef?.current;

  const handleShowPlots = (value) => {
    setClickedPlot(null);
    setShowPlots(value);
  };

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

  const handleDrawComplete = (event) => {
    console.log('mode', event.mode);
    // delete draws after completion
    console.log('event', event);
    if (event.mode === 'simple_select' && mode === 'editing-plot') {
      draw.deleteAll();
    }
  };

  const handleEditPlot = (plot) => {
    if (map) {
      const draw = drawRef.current;
      handleFlyToPlot(plot.geometry.coordinates);
      if (draw) {
        setMode('editing-plot');
        // remove anything drawn before
        draw.deleteAll();
        // add the plot to draw layer
        draw.add(plot);
        setEditingPlot(plot);
      }
    }
  };

  const handleDrawChange = (event) => {
    // Update the plot when it is edited
    if (event.features && event.features.length > 0) {
      updatePlot(event.features[0]);
    }
  };

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
  }, []);

  return (
    <PlotContext.Provider
      value={{
        plots,
        addNewPlot,
        updatePlot,
        clickedPlot,
        setClickedPlot,
        showPlots,
        setShowPlots: handleShowPlots,
        handleFlyToPlot,
        handleEditPlot,
        handleDrawChange,
        weeksBefore,
        setWeeksBefore,
        ndviLoading,
        setNdviLoading,
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
