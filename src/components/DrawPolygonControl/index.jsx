import { useCallback, useContext, useEffect, useState } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import './mapbox-draw-style.css';
import './styles.css';
import DrawActionsPopup from '../DrawActionsPopup';
import { useControl } from 'react-map-gl/maplibre';
import { MapContext } from '../../contexts/MapContext';
import useMapStore from '@/stores/mapStore';
import { VIEW_MODES } from '@/stores/mapStore';
import { FaPlantWilt } from 'react-icons/fa6';
import { Button } from '../ui/button';
import ActionsPopup from '../ActionsPopup';

export function DrawPolygonControl() {
  const [features, setFeatures] = useState({});
  const setViewMode = useMapStore((state) => state.setViewMode);
  const viewMode = useMapStore((state) => state.viewMode);
  const [drawMode, setDrawMode] = useState();

  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const { drawRef, mapRef, showDrawActionPopup, setShowDrawActionPopup } =
    useContext(MapContext);

  const constants = MapboxDraw.constants;

  // Set the custom classes for MapLibre
  constants.classes.CONTROL_BASE = 'maplibregl-ctrl';
  constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-';
  constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group';

  const onCreate = useCallback((e) => {
    console.log('onCreate');
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onUpdate = onCreate;

  const onDelete = useCallback((e) => {
    // when editing plot
    if (viewMode in [VIEW_MODES.EDIT_PLOT, VIEW_MODES.EDIT_MARKER]) {
      setViewMode(VIEW_MODES.NORMAL);
    }
    console.log('mode after deleting', e.mode);
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

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

      drawRef.current = draw;
      return draw;
    },
    ({ map }) => {
      map.on('draw.create', onCreate);
      map.on('draw.update', onUpdate);
      map.on('draw.delete', onDelete);
    },
    ({ map }) => {
      map.off('draw.create', onCreate);
      map.off('draw.update', onUpdate);
      map.off('draw.delete', onDelete);
    },
    {
      position: 'top-right',
    }
  );

  const handleModeChange = (e) => {
    console.log('mode changed', e.mode);
    // when everything is cleared, set mode to view
    setDrawMode(e.mode);
  };

  const handleSelectionChange = (e) => {
    // what if more than one feature is selected? where will the
    // popup be displayed?
    // when feature is deleted, the popup should disappear
    console.log('selection changed', e);
    // print all drawn features to consule
    const selected = drawRef.current.getSelected();
    setSelectedFeatures(selected);
    setShowDrawActionPopup(selected.features.length > 0);
  };

  useEffect(() => {
    const mapInstance = mapRef.current.getMap();
    mapInstance.on('draw.modechange', handleModeChange);
    mapInstance.on('draw.selectionchange', handleSelectionChange);

    return () => {
      mapInstance.off('draw.modechange', handleModeChange);
      mapInstance.off('draw.selectionchange', handleSelectionChange);
    };
  }, [drawRef]);

  return null;
}
