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
  {
    id: 'datavis',
    name: 'DataVis',
    url: `https://api.maptiler.com/maps/dataviz/style.json?key=${
      import.meta.env.VITE_MAPTILER_ACCESS_KEY
    }`,
  },
];

export const API_URL = 'https://agviewer.com/api/dashboard/';
export const API_URL2 = 'https://agviewer.com/api';

export const layerOptions = [
  { value: 'NDVI', label: 'NDVI' },
  { value: 'NDVI_RAW', label: 'NDVI_RAW' },
  { value: 'AGRICULTURE', label: 'AGRICULTURE' },
  { value: 'FALSE-COLOR', label: 'False color (vegetation) ' },
  { value: 'MOISTURE-INDEX', label: 'Moisture Index' },
];
