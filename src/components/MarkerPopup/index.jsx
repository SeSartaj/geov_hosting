import { useContext, useState } from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { MarkersContext } from '../../contexts/markersContext';

export default function MarkerPopup() {
  const { clickedMarker, setClickedMarker } = useContext(MarkersContext);

  if (!clickedMarker) return null;

  return (
    <Popup
      anchor='top'
      longitude={Number(clickedMarker.longitude)}
      latitude={clickedMarker.latitude}
      onClose={() => setClickedMarker(null)}
    >
      <div>
        <h3>{clickedMarker.title}</h3>
        <p>{clickedMarker.description}</p>
        <p>longitude: {clickedMarker.longitude}</p>
        <p>latitude: {clickedMarker.latitude}</p>
      </div>
    </Popup>
  );
}
