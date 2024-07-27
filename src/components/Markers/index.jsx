import { useContext } from 'react';
import { MarkersContext } from '../../contexts/markersContext';
import { Marker } from 'react-map-gl/maplibre';
import './styles.css';

export default function Markers() {
  const { markersData, setClickedMarker } = useContext(MarkersContext);

  const handleMarkerClick = (e, marker) => {
    console.log('clicked', marker);
    e.originalEvent.stopPropagation();
    setClickedMarker(marker);
  };

  return markersData.map((marker) => {
    return (
      <Marker
        className='map-marker'
        key={`${marker.id}`}
        longitude={marker.longitude}
        latitude={marker.latitude}
        color={marker.color}
        onClick={(e) => handleMarkerClick(e, marker)}
      />
    );
  });
}
