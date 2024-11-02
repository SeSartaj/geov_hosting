import React from 'react';
import { BiDroplet, BiSolidDroplet } from 'react-icons/bi';
import { Marker } from 'react-map-gl/maplibre';
import { getStationMarkerColor } from '../../utils/getStationMarkerColor';
import { FaDroplet } from 'react-icons/fa6';
import { PiDrop, PiDropFill } from 'react-icons/pi';

const StationMarker = React.memo(function StationMarker({
  marker,
  latitude,
  longitude,
  onClick,
}) {
  const handleClick = (event) => {
    // event.preventDefault();
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
      color={marker.color}
      onClick={handleClick}
    >
      <PiDropFill size={32} color={getStationMarkerColor(marker.paw_status)} />
    </Marker>
  );
});

export default StationMarker;
