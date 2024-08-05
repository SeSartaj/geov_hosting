import { useCallback, useContext, useState } from 'react';
import MapboxDraw, { constants } from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import './mapbox-draw-style.css';
import './styles.css';
import PolygonDrawActionsPopup from '../PolygonDrawActionsPopup';
import { useControl, useMap } from 'react-map-gl';
import { MapContext } from '../../contexts/MapContext';

export function DrawPolygonControl() {
  const [features, setFeatures] = useState({});
  const { drawRef } = useContext(MapContext);
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

  if (features) {
    return (
      <div>
        {Object.values(features).map((feature) => (
          <PolygonDrawActionsPopup key={feature.id} polygon={feature} />
        ))}
      </div>
    );
  }

  return null;
}
