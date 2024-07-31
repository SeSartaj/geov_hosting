import React from 'react';
import { BiDroplet, BiSolidDroplet } from 'react-icons/bi';
import { Marker } from 'react-map-gl/maplibre';
import { getStationMarkerColor } from '../../utils/getStationMarkerColor';

const StationMarker = React.memo(function StationMarker({
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
      color={marker.properties.marker.color}
      onClick={onClick}
    >
      <BiSolidDroplet
        size={32}
        color={getStationMarkerColor(marker.properties.marker.paw_status)}
      />
    </Marker>
  );
});

export default StationMarker;
