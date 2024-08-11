import { useCallback, useContext, useEffect, useState } from 'react';
import MapboxDraw, { constants } from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import './mapbox-draw-style.css';
import './styles.css';
import PolygonDrawActionsPopup from '../PolygonDrawActionsPopup';
import { useControl, useMap } from 'react-map-gl';
import { MapContext } from '../../contexts/MapContext';

const DRAW_LAYERS = [
  'gl-draw-polygon-fill-inactive',
  'gl-draw-polygon-fill-active',
  'gl-draw-polygon-stroke-inactive',
  'gl-draw-polygon-stroke-active',
  // Add more draw layers if necessary (e.g., for points, lines, etc.)
];

export function DrawPolygonControl() {
  const [features, setFeatures] = useState({});
  const [mode, setMode] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const { drawRef, mapRef } = useContext(MapContext);
  // Set the custom classes for MapLibre
  constants.classes.CONTROL_BASE = 'maplibregl-ctrl';
  constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-';
  constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group';

  const onCreate = useCallback((e) => {
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
        controls: {
          point: true,
          polygon: true,
          trash: true,
        },
        // defaultMode: 'draw_polygon',
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
    console.log('mode changed', e);
    setMode(e.mode);
  };

  const handleSelectionChange = (e) => {
    // what if more than one feature is selected? where will the
    // popup be displayed?
    // when popup is deleted, the popup should disappear
    console.log('selection changed', e);
    // print all drawn features to consule
    console.log('selected Ids', drawRef.current.getSelectedIds());
    setSelectedFeatures(drawRef.current.getSelected());
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

  console.log('selected Features', selectedFeatures, mode);

  if (selectedFeatures) {
    return (
      <div>
        {selectedFeatures?.features?.map((feature) => (
          <PolygonDrawActionsPopup key={feature.id} polygon={feature} />
        ))}
      </div>
    );
  }

  return null;
}
