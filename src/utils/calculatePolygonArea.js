import { area } from '@turf/turf';
export function calculatePolygonArea(polygonFeature) {
  console.log(polygonFeature);
  if (
    !polygonFeature ||
    polygonFeature.type !== 'Feature' ||
    polygonFeature.geometry.type !== 'Polygon'
  ) {
    throw new Error('Invalid polygon feature');
  }

  return area(polygonFeature);
}
