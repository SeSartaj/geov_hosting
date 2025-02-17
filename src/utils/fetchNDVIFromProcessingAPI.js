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
}`;

const ndviCache = {};
const etCache = {};

async function fetchNDVIFromProcessingAPI(
  plot,
  { weeksBefore = 0, accessToken, dateRange }
) {
  console.log('downloading cropped ndvi', dateRange);

  if (!accessToken) {
    console.error('No access token provided');
    return null;
  }

  // Ensure dateRange.start is at the beginning of the day and the 'end' end of the day
  let start = new Date(dateRange.start.setHours(0, 0, 1)).toISOString();
  let end = new Date(dateRange.end.setHours(23, 59, 59)).toISOString();

  const cacheKey = `${plot.properties.id}-${start}`;

  console.log('crop cacheKey', cacheKey);

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
          coordinates: plot.geometry.coordinates,
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
              from: start,
              to: end,
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

async function fetchNDVIFromGeoServer(plot) {
  const bboxCoords = bbox(plot);
  if (!bboxCoords) {
    throw new Error('Invalid BBOX');
  }

  const bboxStr = bboxCoords.join(',');

  const geoserverUrl =
    `https://d27s6pvwcjpmsu.cloudfront.net/geoserver/ne/wms?` +
    new URLSearchParams({
      service: 'WMS',
      version: '1.1.0',
      request: 'GetMap',
      layers: 'ne:et_data',
      styles: '',
      bbox: bboxStr,
      width: 512,
      height: 512,
      srs: 'EPSG:4326',
      format: 'image/png',
      transparent: 'true',
    });

  try {
    const response = await fetch(geoserverUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch NDVI data from GeoServer');
    }
    console.log('data returned from the geoserver');
    const blob = await response.blob();
    if (!blob) {
      return null;
    }
    console.log('geoserver', URL.createObjectURL(blob));
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching NDVI from GeoServer:', error);
    return null;
  }
}

async function fetchCroppedETFromGeoServer(plot, dateRange) {
  console.log('downloading cropped et', dateRange);

  // clone dateRange
  let start;
  let end;
  // when daterange is js Date, convert it to string
  start = dateRange.start.toISOString().split('T')[0];
  end = dateRange.end.toISOString().split('T')[0];
  const TIME = `${start}/${end}`;
  const bboxCoords = bbox(plot);
  if (!bboxCoords) {
    throw new Error('Invalid BBOX');
  }

  const cacheKey = `${plot.properties.id}-${start}`;

  console.log('crop cacheKey', cacheKey);

  // Check if the URL is already in the cache
  if (etCache[cacheKey]) {
    console.log('ET data found in cache');
    return etCache[cacheKey];
  }

  const bboxStr = bboxCoords.join(',');

  const geoserverUrl =
    `https://d27s6pvwcjpmsu.cloudfront.net/geoserver/ne/wms?` +
    new URLSearchParams({
      service: 'WMS',
      version: '1.1.0',
      request: 'GetMap',
      layers: 'ne:et_data',
      styles: '',
      bbox: bboxStr,
      width: 512,
      height: 512,
      srs: 'EPSG:4326',
      format: 'image/png',
      transparent: 'true',
      TIME: TIME,
    });

  try {
    const response = await fetch(geoserverUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch cropped NDVI from GeoServer');
    }
    const blob = await response.blob();
    if (!blob) {
      return null;
    }
    const url = URL.createObjectURL(blob);
    etCache[cacheKey] = url;
    return url;
  } catch (error) {
    console.error('Error fetching cropped NDVI:', error);
    return null;
  }
}

async function fetchCroppedImage(plot) {
  console.log('downloading cropped et');
  const bboxCoords = bbox(plot);
  if (!bboxCoords) {
    throw new Error('Invalid BBOX');
  }

  const bboxStr = bboxCoords.join(',');

  // Encode the plot's geometry as WKT for filtering
  const wktPolygon = `POLYGON((${plot.geometry.coordinates[0]
    .map(([lon, lat]) => `${lon} ${lat}`)
    .join(',')}))`;

  const geoserverUrl =
    `https://d27s6pvwcjpmsu.cloudfront.net/geoserver/ne/wms?` +
    new URLSearchParams({
      service: 'WMS',
      version: '1.1.0',
      request: 'GetMap',
      layers: 'ne:et_data',
      styles: '',
      bbox: bboxStr,
      width: 512,
      height: 512,
      srs: 'EPSG:4326',
      format: 'image/png',
      transparent: 'true',
    });

  try {
    const response = await fetch(geoserverUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch cropped NDVI from GeoServer');
    }
    const blob = await response.blob();
    if (!blob) {
      return null;
    }
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching cropped NDVI:', error);
    return null;
  }
}

export async function cropRasterToPolygon(imageUrl, plot) {
  return new Promise((resolve) => {
    const img = new Image();
    // img.crossOrigin = 'Anonymous'; // Avoid CORS issues
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image first
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Convert polygon to image pixel coordinates
      const polygonPixels = plot.geometry.coordinates[0].map(([lon, lat]) => {
        return geoToPixel(lon, lat, bbox(plot), img.width, img.height);
      });

      // Create a mask
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      polygonPixels.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();

      // Get final cropped image
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageUrl;
  });
}

// Convert GeoJSON coordinates to pixel coordinates in the image
function geoToPixel(lon, lat, bbox, width, height) {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const x = ((lon - minLon) / (maxLon - minLon)) * width;
  const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
  return [x, y];
}

export async function getCroppedRaster(
  plot,
  { rasterLayer, dateRange, accessToken, map }
) {
  console.log('getCroppedRaster rasterLayer', rasterLayer, dateRange);
  if (!dateRange.start instanceof Date || !dateRange.end instanceof Date) {
    console.error('DateRange is not of type Date');
    return;
  }
  if (rasterLayer === 'ET' || rasterLayer?.value === 'ET') {
    const imageUrl = await fetchCroppedETFromGeoServer(plot, dateRange);
    if (!imageUrl) return null;

    const croppedImageUrl = await cropRasterToPolygon(imageUrl, plot);
    console.log('croppedImageURl', croppedImageUrl);
    if (!croppedImageUrl) return null;
    console.log('crop getCroppedRaster crop image URL', imageUrl);
    return croppedImageUrl;
  } else if (rasterLayer === '3_NDVI' || rasterLayer?.value === '3_NDVI') {
    return await fetchNDVIFromProcessingAPI(plot, { accessToken, dateRange });
  }
}

export default fetchNDVIFromProcessingAPI;
