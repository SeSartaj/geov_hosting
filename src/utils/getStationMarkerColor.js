export function getStationMarkerColor(paw_status) {
  switch (paw_status) {
    case 'SEVERE_STRESS':
      return '#ef6666';
    case 'STRESS_START':
      return '#efef66';
    case 'OPTIMAL':
      return '#5dae5d';
    case 'EXCESS_WATER':
      return '#00bfff';
  }
}
