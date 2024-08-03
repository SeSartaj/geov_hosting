export function getStationMarkerColor(paw_status) {
  switch (paw_status) {
    case 'SEVERE_STRESS':
      return 'red';
    case 'STRESS_START':
      return 'orange';
    case 'OPTIMAL':
      return 'green';
    case 'EXCESS_WATER':
      return 'blue';
  }
}