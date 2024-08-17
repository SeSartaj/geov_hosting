import { useContext, useDebugValue, useEffect, useState } from 'react';
import { PlotContext } from '../../contexts/PlotContext';
import { MapContext } from '../../contexts/MapContext';
import { LngLatBounds, Padding } from 'maplibre-gl';
import { calculatePolygonArea } from '../../utils/calculatePolygonArea';
import { squareMetersToAcres } from '../../utils/squareMetersToAcres';
import { BiPencil } from 'react-icons/bi';
import ToggleButton from '@/ui-components/toggleButton';

export default function PlotPanel() {
  const { plots, updatePlot, showPlots, setShowPlots } =
    useContext(PlotContext);
  const { mapRef, drawRef } = useContext(MapContext);
  const [editingPlot, setEditingPlot] = useState(null);

  const map = mapRef.current.getMap();
  const draw = drawRef.current;

  const handleDrawComplete = (event) => {
    console.log('mode', event.mode);
    // delete draws after completion
    console.log('event', event);
    console.log('deleting edited plot drawing layer', editingPlot);
    if (event.mode === 'simple_select') {
      draw.delete([editingPlot?.id]);
    }
  };
  const handleDrawChange = (event) => {
    // Update the plot when it is edited
    if (event.features && event.features.length > 0) {
      updatePlot(event.features[0]);
    }
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

  const handleEditPlot = (plot) => {
    console.log('plot to be edited', plot);
    if (map) {
      console.log('editing inside');
      const draw = drawRef.current;
      handleFlyToPlot(plot.geometry.coordinates);
      if (draw) {
        // remove anything drawn before
        draw.deleteAll();
        // add the plot to draw layer
        draw.add(plot);
        setEditingPlot(plot);
      }
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

  useEffect(() => {
    console.log('editingPlot changed', editingPlot);
  }, [editingPlot]);

  return (
    <div className='panel-container'>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Plots</h3>
        {/* <MyButton>Add new Plot</MyButton> */}
        <ToggleButton
          onTooltip='hide plots'
          offTooltip='show plots'
          initialState={showPlots}
          onToggle={setShowPlots}
        />
      </div>
      <hr className='my-2' />
      <ul className='overflow-y-scroll'>
        {plots.map((plot, index) => (
          <li
            key={index}
            className='inline-flex justify-between items-center p-2 border w-full'
          >
            <span onClick={() => handleFlyToPlot(plot.geometry.coordinates)}>
              {plot.properties.name}(
              {squareMetersToAcres(calculatePolygonArea(plot)).toFixed(1)}
              acres)
            </span>
            <span onClick={() => handleEditPlot(plot)}>
              <BiPencil className='action-icon' />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
