import React, { useEffect, useContext, useState } from 'react';
import { Popup } from 'react-map-gl';
import { MapContext } from '../../contexts/MapContext';
import AddPlotModal from '../AddPlotModal';
import AddNewMarkerModal from '../AddNewMarkerModal';

export default function DrawActionsPopup({ feature }) {
  const { drawRef, mapRef } = useContext(MapContext);
  const [showPopup, setShowPopup] = useState(true);
  const [drawMode, setDrawMode] = useState('');

  useEffect(() => {
    if (!drawRef || !mapRef) return;

    const checkDrawMode = () => {
      const mode = drawRef?.current.getMode();
      console.log('mooode is ', mode);
      setDrawMode(mode);
    };

    // Listen for mode change events
    mapRef?.current.on('draw.modechange', checkDrawMode);

    // Initial check on component mount
    checkDrawMode();

    // Cleanup event listener on component unmount
    return () => {
      mapRef?.current.off('draw.modechange', checkDrawMode);
    };
  }, [drawRef, mapRef]);

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
