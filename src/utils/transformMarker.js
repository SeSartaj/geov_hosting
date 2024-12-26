export function transformMarker(marker) {
  // console.log('mmk', marker);
  // if no device is connected to it, it is a forecast marker
  if (typeOfMarker(marker) === 'forecast') {
    return transformForecastMarker(marker);
  } else if (typeOfMarker(marker) === 'station') {
    return transformStationMarker(marker);
  }
  throw new Error('Could not identify type of the marker', marker);
}

function typeOfMarker(marker) {
  if (!marker?.device || !marker.device?.length === 0) {
    // console.log('forecast marker', marker);
    return 'forecast';
  }
  switch (marker.device.api) {
    case 'Zentra':
      return 'station';
    case 'Fieldclimate':
      return 'forecast';
    default:
      return null;
  }
}

function transformStationMarker(marker) {
  return {
    type: 'station',
    title: `${marker.device.name} [${marker.device.serial}] ${marker?.location_name}`,
    location: marker.use_custom_location
      ? { lng: marker.lng, lat: marker.lat }
      : marker.device.details.location,
    longitude: marker.use_custom_location
      ? marker.lng
      : marker.device.details.location.lng,
    latitude: marker.use_custom_location
      ? marker.lat
      : marker.device.details.location.lat,
    battery: {
      percentage: marker.device.details.battery,
      is_low: marker.device.is_battery_low,
    },
    crop: marker.device.crop,
    paw_status: getPAWStation(marker.avg_paw),
    ...marker,
  };
}

function transformForecastMarker(marker) {
  return {
    type: 'forecast',
    title: `Forecast marker `,
    location: marker.use_custom_location
      ? { lng: marker.lng, lat: marker.lat }
      : marker?.device?.details?.location,
    latitude: marker.use_custom_location
      ? marker.lat
      : marker?.device?.details?.location?.lat,
    longitude: marker.use_custom_location
      ? marker.lng
      : marker?.device?.details?.location?.lng,
    ...marker,
  };
}

const getPAWStation = (paw) => {
  if (paw < 30) return 'SEVERE_STRESS';
  if (paw < 70) return 'STRESS_START';
  if (paw < 100) return 'OPTIMAL';
  return 'EXCESS_WATER';
};
