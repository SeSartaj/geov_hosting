import React from 'react';
import { BiDroplet, BiSolidCloud, BiSolidDroplet } from 'react-icons/bi';
import { Marker } from 'react-map-gl/maplibre';

const ForecastMarker = React.memo(function ForecastMarker({
  marker,
  latitude,
  longitude,
  onClick,
}) {

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Marker
      className='map-marker'
      key={marker.id}
      longitude={longitude}
      latitude={latitude}
      onClick={handleClick}
    >
      <BiSolidCloud size={32} color='blue' />
    </Marker>
  );
});

export default ForecastMarker;
