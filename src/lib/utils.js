import { ET_BASE_URL } from '@/constants';
import { clsx } from 'clsx';
import { LngLatBounds } from 'maplibre-gl';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function getETTimeSeriesData(pickerData, config = {}) {
  console.log('ccc pickerData', pickerData);
  let latitude, longitude, bbox;

  // Construct the WMS URL with the calculated or provided BBOX and date range
  const baseUrl = `${ET_BASE_URL}wms`;

  // Determine the startDate and endDate
  let { startDate, endDate } = config;

  if (!startDate || !endDate) {
    // If no startDate or endDate is provided, get the past 3 months
    const currentDate = new Date();
    endDate = currentDate.toISOString();
    currentDate.setMonth(currentDate.getMonth() - 3); // Subtract 3 months
    startDate = currentDate.toISOString();
  }

  let queryUrl;
  // Check if pickerData contains coordinates or plot
  if (pickerData.coordinates) {
    latitude = pickerData.coordinates.lat;
    longitude = pickerData.coordinates.lng;

    // Calculate a small BBOX around the coordinates (0.0001 degrees)
    const halfWidth = 0.0001;
    const halfHeight = 0.0001;

    const minX = longitude - halfWidth;
    const maxX = longitude + halfWidth;
    const minY = latitude - halfHeight;
    const maxY = latitude + halfHeight;

    bbox = `${minX},${minY},${maxX},${maxY}`;
  } else if (pickerData.plot) {
    const polygonCords = pickerData.plot.geometry.coordinates[0];
    console.log('ccc plot', polygonCords);

    // Convert polygon coordinates to a WMS-compatible format
    const wktPolygon = `Polygon((${polygonCords
      .map((coord) => `${coord[0]} ${coord[1]}`)
      .join(',')},${polygonCords[0][0]} ${polygonCords[0][1]}))`;

    console.log('ccc wktPolygon', wktPolygon);

    const queryParams = new URLSearchParams({
      SERVICE: 'WMS',
      VERSION: '1.1.1',
      REQUEST: 'GetTimeSeries',
      FORMAT: 'image/jpeg',
      TIME: `${startDate}/${endDate}`,
      QUERY_LAYERS: 'et_data',
      STYLES: '',
      LAYERS: 'et_data',
      INFO_FORMAT: 'text/csv',
      FEATURE_COUNT: '50',
      X: '0',
      Y: '0',
      SRS: 'EPSG:4326',
      WIDTH: '1',
      HEIGHT: '1',
      BBOX: bbox,
      FEATURE: wktPolygon,
    });

    queryUrl = `${baseUrl}?${queryParams.toString()}`;

    // Construct the query URL with CQL_FILTER
    // queryUrl = `${baseUrl}?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetTimeSeries&FORMAT=image%2Fjpeg&TIME=${startDate}/${endDate}&QUERY_LAYERS=et_data&STYLES&LAYERS=et_data&INFO_FORMAT=text%2Fcsv&FEATURE_COUNT=50&X=0&Y=0&SRS=EPSG%3A4326&WIDTH=1&HEIGHT=1&CQL_FILTER=${encodeURIComponent(
    //   cqlFilter
    // )}`;

    console.log('time series for a polygon is not implemented yet');
  }

  if (!bbox && !queryUrl) {
    console.error('No valid coordinates or plot data provided.');
    return null;
  } else if (bbox && !queryUrl) {
    const queryParams = new URLSearchParams({
      SERVICE: 'WMS',
      VERSION: '1.1.1',
      REQUEST: 'GetTimeSeries',
      FORMAT: 'image/jpeg',
      TIME: `${startDate}/${endDate}`,
      QUERY_LAYERS: 'et_data',
      STYLES: '',
      LAYERS: 'et_data',
      INFO_FORMAT: 'text/csv',
      FEATURE_COUNT: '50',
      X: '0',
      Y: '0',
      SRS: 'EPSG:4326',
      WIDTH: '1',
      HEIGHT: '1',
      BBOX: bbox,
    });

    queryUrl = `${baseUrl}?${queryParams.toString()}`;
  }

  console.log('ccc queryUrl', queryUrl);

  // Fetch the CSV data
  try {
    const response = await fetch(queryUrl);
    const csvData = await response.text();
    console.log('ccc', csvData);

    // Parse the CSV data into a usable format
    const parsedData = parseCSV(csvData);
    console.log('ccc Parsed data:', parsedData);
    return parsedData;
  } catch (error) {
    console.error('Error fetching time series data:', error);
    return null;
  }
}

// Helper function to parse CSV data
function parseCSV(csvData) {
  // remove the header and first two comments
  const rows = csvData
    .split('\n')
    .slice(3)
    .filter((r) => r !== ''); // Skip the header
  console.log('ccc', rows);

  const result = rows.map((row) => {
    console.log('ccc row', row);
    const columns = row.split(',');
    if (columns.length !== 2) {
      return null;
    }
    const [time, ne_et_data] = columns;
    return [time.trim(), parseFloat(ne_et_data.trim())];
  });

  return result;
}
