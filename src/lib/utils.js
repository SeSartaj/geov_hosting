import { ET_BASE_URL } from '@/constants';
import { clsx } from 'clsx';
import { LngLatBounds } from 'maplibre-gl';
import { twMerge } from 'tailwind-merge';
import proj4 from 'proj4';

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
    // Convert polygon coordinates to a WMS-compatible format
    const polygonCords = pickerData.plot.geometry.coordinates[0];
    // Transform coordinates to EPSG:3857
    const transformedCoords = polygonCords.map((coord) => {
      const point = proj4('EPSG:4326', 'EPSG:3857', coord);
      return point;
    });
    console.log('ccc coords', polygonCords, transformedCoords);

    // Convert polygon coordinates to GeoJSON FeatureCollection
    const geoJsonPolygon = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [polygonCords],
          },
        },
      ],
    };
    const polgyonShape = JSON.stringify(geoJsonPolygon);

    return getPlotStatistics(polgyonShape, startDate, config).then(
      (statistics) => {
        statistics.datetime = startDate;
        console.log('statistics ET for polygon:', statistics);
        return statistics;
      }
    );
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

async function getPlotStatistics(polygonGeojson, time, config = {}) {
  console.log('ffff  time', time, polygonGeojson);
  // Base URL for your GeoServer WPS endpoint
  const WPS_BASE_URL = `${ET_BASE_URL}wps?service=WPS&version=1.0.0&request=Execute`;

  // WPS request XML payload
  const xmlPayload = `
    <wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier>gs:RasterZonalStatistics</ows:Identifier>
    <wps:DataInputs>
      <wps:Input>
        <ows:Identifier>data</ows:Identifier>
        <wps:Reference mimeType="image/tiff" xlink:href="http://geoserver/wcs" method="POST">
          <wps:Body>
            <wcs:GetCoverage service="WCS" version="1.1.1">
              <ows:Identifier>ne:et_data</ows:Identifier>
              <wcs:DomainSubset>
                <ows:BoundingBox crs="http://www.opengis.net/gml/srs/epsg.xml#3857">
                  <ows:LowerCorner>-8082558.050344551 -4550317.438437675</ows:LowerCorner>
                  <ows:UpperCorner>-7866796.799005218 -3980621.5613618423</ows:UpperCorner>
                </ows:BoundingBox>
                  <wcs:TemporalSubset>
                  <gml:TimePosition xmlns:gml="http://www.opengis.net/gml">${time}</gml:TimePosition>
                </wcs:TemporalSubset>
              </wcs:DomainSubset>
              <wcs:Output format="image/tiff"/>
            </wcs:GetCoverage>
          </wps:Body>
        </wps:Reference>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>zones</ows:Identifier>
        <wps:Data>
          <wps:ComplexData mimeType="application/json">
            <![CDATA[${polygonGeojson}]]>
          </wps:ComplexData>
        </wps:Data>
      </wps:Input>
    </wps:DataInputs>
    <wps:ResponseForm>
      <wps:RawDataOutput mimeType="application/json">
        <ows:Identifier>statistics</ows:Identifier>
      </wps:RawDataOutput>
    </wps:ResponseForm>
  </wps:Execute>

  `;

  try {
    const response = await fetch(WPS_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlPayload,
    });

    if (!response.ok) {
      throw new Error(`WPS request failed with status ${response.status}`);
    }

    const data = await response.json();
    data.datetime = time;
    console.log('WPS Response:', data);

    // Parse the XML response to extract the mean value
    // const parser = new DOMParser();
    // const xmlDoc = parser.parseFromString(data, 'text/xml');
    // const meanValue = xmlDoc.getElementsByTagName('mean')[0]?.textContent;
    console.log('returning this data', data);
    return data;
  } catch (error) {
    console.error('Error executing WPS request:', error);
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
