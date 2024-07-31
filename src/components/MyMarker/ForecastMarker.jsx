import React from 'react';
import { BiDroplet, BiSolidCloud, BiSolidDroplet } from 'react-icons/bi';
import { Marker } from 'react-map-gl/maplibre';

const ForecastMarker = React.memo(function ForecastMarker({
  marker,
  latitude,
  longitude,
  onClick,
}) {
  return (
    <Marker
      className='map-marker'
      key={marker.properties.marker.id}
      longitude={longitude}
      latitude={latitude}
      onClick={onClick}
    >
      <BiSolidCloud size={32} color='blue' />
    </Marker>
  );
});

export default ForecastMarker;
