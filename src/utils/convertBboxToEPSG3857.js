import proj4 from 'proj4';

/**
 * Convert a bounding box from EPSG:4326 to EPSG:3857.
 * @param {number[]} bbox4326 - The bounding box in EPSG:4326 format [minX, minY, maxX, maxY].
 * @returns {number[]} - The bounding box in EPSG:3857 format [minX, minY, maxX, maxY].
 */
export const convertBboxToEPSG3857 = (bbox4326) => {
  // Define the EPSG:4326 (WGS 84) and EPSG:3857 (Web Mercator) projections
  const epsg4326 = 'EPSG:4326';
  const epsg3857 = 'EPSG:3857';

  // Convert each corner of the BBOX from EPSG:4326 to EPSG:3857
  const [minX, minY] = proj4(epsg4326, epsg3857, [bbox4326[0], bbox4326[1]]);
  const [maxX, maxY] = proj4(epsg4326, epsg3857, [bbox4326[2], bbox4326[3]]);

  // Return the BBOX in EPSG:3857 format
  return [minX, minY, maxX, maxY];
};
