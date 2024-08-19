import { getAccessToken } from '@/api/sentinalHubApi';
import { convertBboxToEPSG3857 } from './convertBboxToEPSG3857';
import { bbox } from '@turf/turf';

const evalscript = `
  //VERSION=3
function setup() {
  return {
    input: ["B04", "B08", "dataMask"],
    output: { bands: 4 }
  };
}

// Define color ramp for NDVI visualization
const ramp = [
  [-0.5, 0x0c0c0c],
  [-0.2, 0xbfbfbf],
  [-0.1, 0xdbdbdb],
  [0, 0xeaeaea],
  [0.025, 0xfff9cc],
  [0.05, 0xede8b5],
  [0.075, 0xddd89b],
  [0.1, 0xccc682],
  [0.125, 0xbcb76b],
  [0.15, 0xafc160],
  [0.175, 0xa3cc59],
  [0.2, 0x91bf51],
  [0.25, 0x7fb247],
  [0.3, 0x70a33f],
  [0.35, 0x609635],
  [0.4, 0x4f892d],
  [0.45, 0x3f7c23],
  [0.5, 0x306d1c],
  [0.55, 0x216011],
  [0.6, 0x0f540a],
  [1, 0x004400],
];

const visualizer = new ColorRampVisualizer(ramp);

function evaluatePixel(samples) {
  // Calculate NDVI
  let ndvi = index(samples.B08, samples.B04);

  // Apply color ramp visualization
  let imgVals = visualizer.process(ndvi);

  // Apply transparency mask
  if (samples.dataMask === 0) {
    // Set transparency for areas outside the mask
    return [0, 0, 0, 0]; // RGBA: fully transparent
  } else {
    // Return color values with full opacity
    return imgVals.concat([1]); // RGBA: fully opaque
  }
}
`;

const ndviCache = {};

async function fetchNDVIFromProcessingAPI(
  plot,
  { weeksBefore = 0, accessToken }
) {
  // the range should be 2 weeks before the from date
  const dateRange = {
    from: new Date(
      new Date().setDate(new Date().getDate() - weeksBefore * 7 - 14)
    ).toISOString(),
    to: new Date(
      new Date().setDate(new Date().getDate() - weeksBefore * 7)
    ).toISOString(),
  };

  const cacheKey = `${plot.properties.id}-${weeksBefore}`;

  // Check if the URL is already in the cache
  if (ndviCache[cacheKey]) {
    console.log('NDVI data found in cache');
    return ndviCache[cacheKey];
  }

  console.log('access Token', accessToken);
  const bboxCoords = convertBboxToEPSG3857(bbox(plot));
  if (!bboxCoords) {
    throw new Error('Invalid BBOX');
  }

  const sentinelHubUrl = 'https://services.sentinel-hub.com/api/v1/process';

  const params = {
    input: {
      bounds: {
        geometry: {
          type: 'Polygon',
          coordinates: plot.geometry.coordinates, // Ensure this is correctly structured
        },
        properties: {
          // crs: 'http://www.opengis.net/def/crs/EPSG/0/32633',
          crs: 'http://www.opengis.net/def/crs/EPSG/0/4326',
        },
      },
      data: [
        {
          type: 'sentinel-2-l2a',
          dataFilter: {
            timeRange: {
              from: dateRange.from,
              to: dateRange.to,
            },
          },
        },
      ],
    },
    output: {
      width: 512,
      height: 512,
      responses: [
        {
          identifier: 'default',
          format: {
            type: 'image/png',
          },
        },
      ],
    },
    evalscript: evalscript,
  };

  try {
    const response = await fetch(sentinelHubUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`, // Your Sentinel Hub access token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch NDVI data');
    }
    const blob = await response.blob();
    if (!blob) {
      return null;
    }
    const url = URL.createObjectURL(blob);

    // Store the URL in the cache
    ndviCache[cacheKey] = url;
    return url;
  } catch (error) {
    console.error('Error fetching NDVI data:', error);
    return null;
  }
}

export default fetchNDVIFromProcessingAPI;
