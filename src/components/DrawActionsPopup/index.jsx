import React, { useEffect, useContext, useState } from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { MapContext } from '../../contexts/MapContext';
import AddPlotModal from '../AddPlotModal';
import AddNewMarkerModal from '../AddNewMarkerModal';

import './styles.css';

export default function DrawActionsPopup({ feature }) {
  const { drawRef, mapRef } = useContext(MapContext);
  const [showPopup, setShowPopup] = useState(true);
  const [drawMode, setDrawMode] = useState('');

  const mapInstance = mapRef?.current;

  useEffect(() => {
    if (!drawRef || !mapInstance) return;

    const checkDrawMode = () => {
      const mode = drawRef?.current.getMode();
      console.log('mooode is ', mode);
      setDrawMode(mode);
    };

    // Listen for mode change events
    mapInstance.on('draw.modechange', checkDrawMode);

    // Initial check on component mount
    checkDrawMode();

    // Cleanup event listener on component unmount
    return () => {
      mapInstance.off('draw.modechange', checkDrawMode);
    };
  }, [drawRef, mapInstance]);

  if (!feature || !showPopup) return null;

  console.log('popup is rendering');

  if (drawMode !== 'simple_select') {
    return null;
  }

  console.log('feature', feature);

  if (feature.geometry.type == 'Point') {
    return (
      <Popup
        latitude={feature.geometry.coordinates[1]}
        longitude={feature.geometry.coordinates[0]}
        closeOnClick={true}
        anchor='top'
      >
        <AddNewMarkerModal feature={feature} />
      </Popup>
    );
  }
  return (
    <Popup
      latitude={feature.geometry.coordinates[0][0][1]}
      longitude={feature.geometry.coordinates[0][0][0]}
      closeOnClick={true}
      anchor='top'
    >
      <AddPlotModal polygon={feature} />
    </Popup>
  );
}
