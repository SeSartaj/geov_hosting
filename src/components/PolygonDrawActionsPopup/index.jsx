import React, { useEffect, useContext, useState } from 'react';
import { Popup } from 'react-map-gl';
import { MapContext } from '../../contexts/MapContext';
import AddPlotModal from '../AddPlotModal';

export default function PolygonDrawActionsPopup({ polygon }) {
  const { drawRef, mapRef } = useContext(MapContext);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    if (!drawRef || !mapRef) return;

    const checkDrawMode = () => {
      const mode = drawRef?.current.getMode();
      console.log('mooode is ', mode);
      if (mode !== 'direct_select' && mode !== 'simple_select') {
        setShowPopup(false);
      } else {
        setShowPopup(true);
      }
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

  if (!polygon || !showPopup) return null;

  console.log('popup is rendering');

  return (
    <Popup
      latitude={polygon.geometry.coordinates[0][0][1]}
      longitude={polygon.geometry.coordinates[0][0][0]}
      closeOnClick={true}
      anchor='top'
    >
      <AddPlotModal polygon={polygon} />
    </Popup>
  );
}
