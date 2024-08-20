export function transformMarker(marker) {
  console.log('mmk', marker);
  // if no device is connected to it, it is a forecast marker
  if (!marker.device?.length === 0) {
    return transformForecastMarker(marker);
  }
  switch (marker.device.api) {
    case 'Zentra':
      return transformStationMarker(marker);
    case 'Fieldclimate':
      return transformForecastMarker(marker);
    default:
      return null;
  }
}

function transformStationMarker(marker) {
  return {
    type: 'station',
    id: marker.id,
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
    avg_paw: marker.avg_paw,
    farm: marker.farm,
    paw_status: getPAWStation(marker.avg_paw),
  };
}

function transformForecastMarker(marker) {
  return {
    type: 'forecast',
    id: marker.id,
    title: `${marker.device.name} [${marker.device.serial}]`,
    location: marker.use_custom_location
      ? { lng: marker.lng, lat: marker.lat }
      : marker.device.details.location,
    latitude: marker.use_custom_location
      ? marker.lat
      : marker.device.details.location.lat,
    longitude: marker.use_custom_location
      ? marker.lng
      : marker.device.details.location.lng,
    battery: {
      percentage: marker.device.details.battery,
      is_low: marker.device.is_battery_low,
    },
  };
}

const getPAWStation = (paw) => {
  if (paw < 30) return 'SEVERE_STRESS';
  if (paw < 70) return 'STRESS_START';
  if (paw < 100) return 'OPTIMAL';
  return 'EXCESS_WATER';
};
