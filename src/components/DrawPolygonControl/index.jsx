import { useContext, useEffect, useState } from 'react';
import MapboxDraw, { constants } from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { MapContext } from '../../contexts/MapContext';
import './mapbox-draw-style.css';
import './styles.css';
import MyButton from '../../ui-components/MyButton';
import PolygonDrawActionsPopup from '../PolygonDrawActionsPopup';

export function DrawPolygonControl() {
  const { mapRef } = useContext(MapContext);
  const map = mapRef.current?.getMap();
  const [polygonCreated, setPolygonCreated] = useState(false);

  useEffect(() => {
    if (!map) return;

    // Set the custom classes for MapLibre
    constants.classes.CONTROL_BASE = 'maplibregl-ctrl';
    constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-';
    constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group';

    // Initialize MapboxDraw
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        polygon: true,
        trash: true,
      },
      defaultMode: 'draw_polygon',
    });

    // Add the draw control to the map
    map.addControl(draw);

    // Event listener for when a polygon is created
    map.on('draw.create', (event) => {
      console.log('polygon created', event);

      // Store the centroid of the polygon to display the popup
      setPolygonCreated(event);
    });

    // Event listener for when a polygon is updated
    map.on('draw.update', (event) => {
      const polygon = event.features[0];
      console.log('Polygon updated:', polygon);
    });

    // Event listener for when a polygon is deleted
    map.on('draw.delete', (event) => {
      console.log('Polygon(s) deleted:', event.features);
    });

    // Cleanup when component unmounts
    return () => {
      map.removeControl(draw);
    };
  }, [map]);

  if (polygonCreated) {
    console.log('p', polygonCreated);
    return (
      <>
        {polygonCreated && <PolygonDrawActionsPopup polygon={polygonCreated} />}
      </>
    );
  }
}
