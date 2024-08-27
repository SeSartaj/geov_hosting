export const NDVI_LAYER_URL =
  'https://services.sentinel-hub.com/ogc/wmts/17ffa220-b013-4a7f-8d5c-895b1b8ef22d?layer=NDVI&&tilematrixset=PopularWebMercator256&Service=WMTS&Request=GetTile&RESOLUTION=10&MAXCC=20&TileMatrix={z}&TileCol={x}&TileRow={y}';

const evalscript = `
  //VERSION=3
  function setup() {
    return {
      input: [{
        bands: [
          "B04",
          "B08",
          "SCL",
          "dataMask"
        ]
      }],
      output: [
        {
          id: "data",
          bands: 1
        },
        {
          id: "dataMask",
          bands: 1
        }]
    }
  }
  
  function evaluatePixel(samples) {
      let ndvi = (samples.B08 - samples.B04)/(samples.B08 + samples.B04)
  
      var validNDVIMask = 1
      if (samples.B08 + samples.B04 == 0 ){
          validNDVIMask = 0
      }
  
      var noWaterMask = 1
      if (samples.SCL == 6 ){
          noWaterMask = 0
      }
  
      return {
          data: [ndvi],
          // Exclude nodata pixels, pixels where ndvi is not defined and water pixels from statistics:
          dataMask: [samples.dataMask * validNDVIMask * noWaterMask]
      }
  }
  `;

// gets client id and secret from the environment
export async function getAccessToken() {
  const tokenUrl = 'https://services.sentinel-hub.com/oauth/token';

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: import.meta.env.VITE_SENTINAL_HUB_CLIENT_ID,
      client_secret: import.meta.env.VITE_SENTINAL_HUB_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to obtain access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function fetchAccessToken(clientId, clientSecret) {
  const url = 'https://services.sentinel-hub.com/oauth/token';
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch access token');
  }

  const data = await response.json();
  return data;
}

export async function fetchMeanNDVI(plot, { accessToken }) {
  const sentinelHubStatUrl =
    'https://services.sentinel-hub.com/api/v1/statistics';

  const stats_request = {
    input: {
      bounds: {
        geometry: {
          type: 'Polygon',
          coordinates: plot.geometry.coordinates, // Ensure this is correctly structured
        },
        properties: {
          crs: 'http://www.opengis.net/def/crs/EPSG/0/4326',
          // crs: 'http://www.opengis.net/def/crs/EPSG/0/32633',
        },
      },
      data: [
        {
          type: 'sentinel-2-l2a',
          dataFilter: {
            mosaickingOrder: 'leastCC',
          },
        },
      ],
    },
    aggregation: {
      timeRange: {
        from: '2024-01-01T00:00:00Z',
        to: '2024-07-31T00:00:00Z',
      },
      aggregationInterval: {
        of: 'P30D',
      },
      evalscript: evalscript,
      resx: 10,
      resy: 10,
    },
  };

  try {
    const response = await fetch(sentinelHubStatUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats_request),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch NDVI statistics');
    }

    const data = await response.json();
    console.log('ndvi data k', data);
    return data?.data;
  } catch (error) {
    console.error('Error fetching NDVI statistics:', error);
    return null;
  }
}

export async function getSatellitePassDates(aoi, startDate, endDate) {
  // if start and end dates are not provided, use the last 6 months
  if (!startDate || !endDate) {
    const today = new Date();
    startDate = new Date(today.setMonth(today.getMonth() - 6))
      .toISOString()
      .split('T')[0]; // YYYY-MM-DD
    endDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  }

  const formattedStartDate = `${startDate}T00:00:00Z`;
  const formattedEndDate = `${endDate}T23:59:59Z`;

  const accessToken = await getAccessToken();
  const url = 'https://services.sentinel-hub.com/api/v1/catalog/search';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const body = {
    bbox: aoi,
    datetime: `${formattedStartDate}/${formattedEndDate}`,
    collections: ['sentinel-2-l1c'],
    limit: 50,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Extract dates from the response
    const dates = data.features.map((feature) => feature.properties.datetime);

    return dates;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
