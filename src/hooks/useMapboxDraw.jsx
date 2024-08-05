import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { useContext, useEffect, useRef } from 'react';
import MapboxDraw, { constants } from '@mapbox/mapbox-gl-draw';
import { MapContext } from '../contexts/MapContext';

export function useMapboxDraw() {
  const { mapRef } = useContext(MapContext);
  const drawRef = useRef(null); // Ref to hold the MapboxDraw instance

  const map = mapRef.current?.getMap();

  // Set the custom classes for MapLibre
  constants.classes.CONTROL_BASE = 'maplibregl-ctrl';
  constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-';
  constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group';

  useEffect(() => {
    if (!map) return;
    if (drawRef.current) {
      console.log('removing previosu draw');
      map.removeControl(drawRef.current);
    }

    // Initialize MapboxDraw and store it in the ref
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        polygon: true,
        trash: true,
      },
      defaultMode: 'draw_polygon',
    });

    drawRef.current = draw;

    // Add the draw control to the map
    map.addControl(draw);

    // Cleanup function to remove the draw control from the map
    return () => {
      if (map && drawRef?.current) {
        map.removeControl(drawRef.current);
      }
    };
  }, [mapRef]); // Dependency on mapRef to run the effect when the map changes
}
