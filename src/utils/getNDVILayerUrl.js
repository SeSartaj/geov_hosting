import { bbox } from '@turf/turf'; // Make sure to import bbox from Turf.js
import { convertBboxToEPSG3857 } from './convertBboxToEPSG3857';

export const getNDVILayerUrl = (plot) => {
  const b = convertBboxToEPSG3857(bbox(plot));

  const baseUrl =
    'https://services.sentinel-hub.com/ogc/wms/17ffa220-b013-4a7f-8d5c-895b1b8ef22d';

  const params = new URLSearchParams({
    LAYERS: 'NDVI',
    MAXCC: 20,
    REQUEST: 'GetMap',
    FORMAT: 'image/jpeg',
    WIDTH: 256,
    HEIGHT: 256,
    TIME: '2024-03-29/2024-05-29',
    BBOX: `${b[0]},${b[1]},${b[2]},${b[3]}`,
  });

  return `${baseUrl}?${params.toString()}`;
};
