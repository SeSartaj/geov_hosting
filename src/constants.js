export const DEFAULT_BASEMAP = `https://api.maptiler.com/maps/satellite/style.json?key=${
  import.meta.env.VITE_MAPTILER_ACCESS_KEY
}`;

export const BASEMAP_OPTIONS = [
  {
    id: 'satellite',
    name: 'Satellite',
    url: `https://api.maptiler.com/maps/satellite/style.json?key=${
      import.meta.env.VITE_MAPTILER_ACCESS_KEY
    }`,
  },
  {
    id: 'basic',
    name: 'Basic',
    url: `https://api.maptiler.com/maps/basic-v2/style.json?key=${
      import.meta.env.VITE_MAPTILER_ACCESS_KEY
    }`,
  },
];

export const API_URL = 'https://agviewer.com/api/dashboard/';
export const API_URL2 = 'https://agviewer.com/api';

export const layerOptions = [
  { value: '3_NDVI', label: 'NDVI' },
  { value: 'NDVI_RAW', label: 'NDVI_RAW' },
  { value: 'AGRICULTURE', label: 'AGRICULTURE' },
  { value: '2_FALSE_COLOR', label: 'False color (vegetation) ' },
  { value: 'MOISTURE-INDEX', label: 'Moisture Index' },
  {
    value: 'ET',
    label: 'Evapotranspiration',
    url: 'https://d27s6pvwcjpmsu.cloudfront.net/geoserver/ne/wms?service=WMS&version=1.1.0&request=GetMap&layers=ne%3Aet_data&bbox={bbox-epsg-3857}&width=512&height=512&srs=EPSG%3A3857&styles=&format=image%2Fpng&transparent=TRUE',
    passDates: [
      '2024-06-01',
      '2024-11-14',
      '2024-11-23',
      '2024-12-07',
      '2024-12-19',
    ],
  },
];
