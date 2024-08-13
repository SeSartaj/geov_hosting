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
