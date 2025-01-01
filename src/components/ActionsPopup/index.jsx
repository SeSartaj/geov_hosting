import './styles.css';

import { useEffect, useContext, useState } from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { MapContext } from '../../contexts/MapContext';
import AddPlotModal from '../AddPlotModal';
import AddNewMarkerModal from '../AddNewMarkerModal';
import useMapStore from '@/stores/mapStore';
import { VIEW_MODES } from '@/stores/mapStore';

export default function ActionsPopup({ feature, children }) {
  const { drawRef, mapRef, setShowDrawActionPopup, mode } =
    useContext(MapContext);
  const [drawMode, setDrawMode] = useState('');
  const viewMode = useMapStore((state) => state.viewMode);

  const mapInstance = mapRef?.current;

  // keep the drawMode updated
  useEffect(() => {
    if (!drawRef || !mapInstance) return;

    const checkDrawMode = () => {
      setDrawMode(drawRef?.current.getMode());
    };

    // Listen for mode change events
    mapInstance.on('draw.modechange', checkDrawMode);

    // Initial check on component mount
    checkDrawMode();

    return () => {
      mapInstance.off('draw.modechange', checkDrawMode);
    };
  }, [drawRef, mapInstance]);

  // if nothing is drawn, don't show any popup
  if (!feature) return null;

  // show the popup only when drawing is complete
  if (drawMode !== 'simple_select') {
    return null;
  }

  return (
    <Popup
      latitude={feature.geometry.coordinates[0][0][1]}
      longitude={feature.geometry.coordinates[0][0][0]}
      closeOnClick={true}
      anchor="top"
    >
      {children}
    </Popup>
  );
}
