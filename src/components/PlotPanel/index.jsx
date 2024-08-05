import { useContext, useDebugValue, useEffect, useState } from 'react';
import MyButton from '../../ui-components/MyButton';
import { PlotContext } from '../../contexts/PlotContext';
import { MapContext } from '../../contexts/MapContext';
import { LngLatBounds, Padding } from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { calculatePolygonArea } from '../../utils/calculatePolygonArea';
import { squareMetersToAcres } from '../../utils/squareMetersToAcres';
import { BiPencil } from 'react-icons/bi';

export default function PlotPanel() {
  const { plots, updatePlot } = useContext(PlotContext);
  const { mapRef, drawRef } = useContext(MapContext);
  const [editingPlot, setEditingPlot] = useState(null);

  const map = mapRef.current.getMap();
  const draw = drawRef.current;

  const handleDrawComplete = (event) => {
    // delete draws after completion
    console.log('event', event);
    console.log('deleting edited plot drawing layer', editingPlot);
    if (event.mode === 'simple_select') {
      draw.delete([editingPlot?.id]);
    }
  };
  const handleDrawChange = (event) => {
    console.log('editingPlot', editingPlot);
    if (event.features && event.features.length > 0) {
      const editedPlotId = event.features[0].id; // Assuming you're working with a single feature
      console.log('Edited plot ID:', editedPlotId);
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
        draw.deleteAll(); // Remove existing features
        draw.add(plot); // Add the new plot to be edited
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
        <MyButton>Add new Plot</MyButton>
      </div>
      <ul className='plot-list'>
        {plots.map((plot, index) => (
          <li key={index}>
            <span onClick={() => handleFlyToPlot(plot.geometry.coordinates)}>
              {plot.properties.name}(
              {squareMetersToAcres(calculatePolygonArea(plot)).toFixed(1)}{' '}
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
