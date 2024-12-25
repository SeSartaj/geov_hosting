import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { GPSIcon } from '@/icons/gps';
import { GPSBlueIcon } from '@/icons/gps-blue';

const GPSColors = (paw_status) => {
  switch (paw_status) {
    case 'SEVERE_STRESS':
      return {
        mainColor: '#E03052',
        secondaryColor: '#F75979',
      };
    case 'STRESS_START':
      return {
        mainColor: '#FFA500',
        secondaryColor: '#FFD700',
      };
    case 'OPTIMAL':
      return {
        mainColor: '#20A35F',
        secondaryColor: '#5CCC91',
      };
    case 'EXCESS_WATER':
      return {
        mainColor: '#00BFFF',
        secondaryColor: '#87CEFA',
      };
  }
};

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

  const pawStatus = marker?.paw_status;

  return (
    <Marker
      className="map-marker"
      key={marker?.id}
      longitude={longitude}
      latitude={latitude}
      color={marker?.color}
      onClick={handleClick}
    >
      {pawStatus === 'EXCESS_WATER' ? (
        <GPSBlueIcon />
      ) : (
        <GPSIcon colors={GPSColors(pawStatus)} />
      )}
    </Marker>
  );
});

export default StationMarker;
