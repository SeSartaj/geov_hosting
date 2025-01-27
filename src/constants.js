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

export const ET_BASE_URL = 'https://d27s6pvwcjpmsu.cloudfront.net/geoserver/';

export const layerOptions = [
  { value: '3_NDVI', label: 'NDVI' },
  // { value: 'NDVI_RAW', label: 'NDVI_RAW' },
  // { value: 'AGRICULTURE', label: 'AGRICULTURE' },
  { value: '2_FALSE_COLOR', label: 'False color (vegetation) ' },
  { value: '5-MOISTURE-INDEX1', label: 'Moisture Index' },
  {
    value: 'ET',
    label: 'Evapotranspiration',
    url: `${ET_BASE_URL}ne/wms?service=WMS&version=1.1.0&request=GetMap&layers=ne%3Aet_data&bbox={bbox-epsg-3857}&width=512&height=512&srs=EPSG%3A3857&styles=&format=image%2Fpng&transparent=TRUE`,
    getValueUrl: `${ET_BASE_URL}ne/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=ne%3Aet_data&propertyName=*&srsName=EPSG:4326&filter=<Filter><Point><coordinates>{lon},{lat}</coordinates></Point></Filter>&outputFormat=application/json`,
    passDates: [
      '2024-06-01',
      '2024-11-14',
      '2024-11-23',
      '2024-12-07',
      '2024-12-19',
    ],
    getAvailableDates: async function getAvailableDates(bbox) {
      const wmsUrl = 'https://d27s6pvwcjpmsu.cloudfront.net/geoserver/ne/wms';
      const layerName = 'et_data';

      // Construct the GetCapabilities request URL
      const capabilitiesUrl = `${wmsUrl}?service=WMS&version=1.1.0&request=GetCapabilities`;

      try {
        // Fetch the GetCapabilities XML
        const response = await fetch(capabilitiesUrl);
        const xmlText = await response.text();

        // Parse the XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        // Find the et_data layer (nested inside another Layer node)
        const layerNodes = xmlDoc.querySelectorAll('Layer');
        let layerNode = null;

        for (const node of layerNodes) {
          const nameNode = node.querySelector('Name');
          if (nameNode && nameNode.textContent === layerName) {
            layerNode = node;
            break;
          }
        }

        if (!layerNode) {
          throw new Error(`Layer ${layerName} not found in capabilities.`);
        }

        // Extract the time dimension values for the layer
        const dimensionNode = layerNode.querySelector("Dimension[name='time']");
        if (!dimensionNode) {
          throw new Error('Time dimension not found for the layer.');
        }

        const extentNode = layerNode.querySelector("Extent[name='time']");
        if (!extentNode) {
          throw new Error('Time extent not found for the layer.');
        }

        const timeValues = extentNode.textContent.trim().split(',');
        return timeValues;
      } catch (error) {
        console.error('Error fetching available dates:', error);
        return [];
      }
    },
  },
];
