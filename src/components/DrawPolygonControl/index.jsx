import { useCallback, useContext, useEffect, useState } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import './mapbox-draw-style.css';
import './styles.css';
import { useControl } from 'react-map-gl/maplibre';
import { MapContext } from '../../contexts/MapContext';

export function DrawPolygonControl() {
  const { drawRef } = useContext(MapContext);

  const constants = MapboxDraw.constants;

  // Set the custom classes for MapLibre
  constants.classes.CONTROL_BASE = 'maplibregl-ctrl';
  constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-';
  constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group';

  const onCreate = useCallback((e) => {
    console.log('onCreate');
  }, []);

  const onUpdate = onCreate;

  useControl(
    () => {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        styles: [
          // Style for the polygon fill
          {
            id: 'gl-draw-polygon-fill',
            type: 'fill',
            filter: [
              'all',
              ['==', '$type', 'Polygon'],
              ['!=', 'mode', 'static'],
            ],
            paint: {
              'fill-color': '#FF0000', // Red fill color
              'fill-opacity': 0.5, // Semi-transparent
            },
          },
          // Style for the active line while drawing
          {
            id: 'gl-draw-line-active',
            type: 'line',
            filter: [
              'all',
              ['==', '$type', 'LineString'],
              ['==', 'active', 'true'], // Active drawing lines
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#FF0000', // Red line
              'line-width': 3, // Line width
              'line-dasharray': [2, 2], // Dashed line
            },
          },
          // Style for the polygon outline
          {
            id: 'gl-draw-polygon-stroke-active',
            type: 'line',
            filter: [
              'all',
              ['==', '$type', 'Polygon'],
              ['!=', 'mode', 'static'],
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#0000FF', // Blue outline
              'line-width': 2,
            },
          },
          // Style for the midpoints (handles for editing)
          {
            id: 'gl-draw-polygon-midpoint',
            type: 'circle',
            filter: ['all', ['==', 'meta', 'midpoint']],
            paint: {
              'circle-radius': 5,
              'circle-color': '#00FF00', // Green midpoint
            },
          },
          // Style for the vertices (points at corners)
          {
            id: 'gl-draw-polygon-vertex',
            type: 'circle',
            filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
            paint: {
              'circle-radius': 7,
              'circle-color': '#FFA500', // Orange vertices
            },
          },
          {
            id: 'gl-draw-polygon-point-active',
            type: 'circle',
            filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Point']],
            paint: {
              'circle-radius': 10,
              'circle-color': 'red', // Orange for active vertex
            },
          },
        ],
      });

      // store the reference in drawRef
      drawRef.current = draw;
      return draw;
    },
    ({ map }) => {
      map.on('draw.create', onCreate);
      map.on('draw.update', onUpdate);
    },
    ({ map }) => {
      map.off('draw.create', onCreate);
      map.off('draw.update', onUpdate);
    },
    {
      position: 'top-right',
    }
  );

  return null;
}
