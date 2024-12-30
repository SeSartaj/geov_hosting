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
  console.log('getAccessToken', data);
  return data;
}

// export async function fetchAccessToken() {
//   const response = await fetch('http://localhost:5000/api/token');
//   if (!response.ok) {
//     throw new Error('Failed to fetch access token');
//   }
//   const data = await response.json();
//   console.log('access token is', data);
//   return data;
// }

export async function fetchMeanNDVI(plot, { accessToken, startDate, endDate }) {
  // if startDate is not provided, set it to the past 3 months
  const START_DATE =
    startDate ||
    new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString();
  // if endDate is not provided, set it to the current date
  const END_DATE = endDate || new Date().toISOString();

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
        from: START_DATE,
        to: END_DATE,
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

export async function fetchMeanNDVIForPoint(
  point,
  { accessToken, startDate, endDate }
) {
  const longitude = point.lng;
  const latitude = point.lat;
  const smallOffset = 0.0001; // Adjust the offset to define the size of the polygon

  // if startDate is not provided, set it to the past 3 months
  const START_DATE =
    startDate ||
    new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString();
  // if endDate is not provided, set it to the current date
  const END_DATE = endDate || new Date().toISOString();

  const smallPolygon = {
    type: 'Polygon',
    coordinates: [
      [
        [longitude - smallOffset, latitude - smallOffset],
        [longitude + smallOffset, latitude - smallOffset],
        [longitude + smallOffset, latitude + smallOffset],
        [longitude - smallOffset, latitude + smallOffset],
        [longitude - smallOffset, latitude - smallOffset], // Closing the polygon
      ],
    ],
  };

  const sentinelHubStatUrl =
    'https://services.sentinel-hub.com/api/v1/statistics';

  const stats_request = {
    input: {
      bounds: {
        geometry: smallPolygon,
        properties: {
          crs: 'http://www.opengis.net/def/crs/EPSG/0/4326',
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
        from: START_DATE,
        to: END_DATE,
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
    console.log('NDVI data for point:', data);
    return data?.data;
  } catch (error) {
    console.error('Error fetching NDVI statistics for point:', error);
    return null;
  }
}

export async function getSatellitePassDates({
  aoi,
  startDate,
  endDate,
  accessToken,
}) {
  console.log('accessToken', accessToken);
  if (!accessToken) {
    throw new Error('Access token is required');
  }
  // if start and end dates are not provided, use the last 6 months
  if (!startDate || !endDate) {
    const today = new Date();
    startDate = new Date(today.setMonth(today.getMonth() - 6)).toISOString();
    endDate = new Date().toISOString();
  }

  const formattedStartDate = `${startDate}`;
  const formattedEndDate = `${endDate}`;

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
    // only get those where cloud coverage is less than 20%
    query: {
      'eo:cloud_cover': {
        lte: 20, // Max cloud coverage 20%
      },
    },
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
    console.log('data returned from catalog', data);
    // Extract dates from the response and sort in descending order
    const dates = data.features
      .map((feature) => new Date(feature.properties.datetime))
      .sort((a, b) => new Date(b) - new Date(a));

    console.log('date from catalog', dates);
    return dates;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
