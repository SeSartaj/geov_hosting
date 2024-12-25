export function getStationMarkerColor(paw_status) {
  switch (paw_status) {
    case 'SEVERE_STRESS':
      return '#FE5351';
    case 'STRESS_START':
      return '#F5A905';
    case 'OPTIMAL':
      return '#00C48C';
    case 'EXCESS_WATER':
      return '#01A6F3';
  }
}
