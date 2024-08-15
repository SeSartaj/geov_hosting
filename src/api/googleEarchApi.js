import ee from '@google/earthengine';
const PRIVATE_KEY = import.meta.env.VITE_GOOGLE_EARTH_API_KEY;

ee.data.authenticateViaPrivateKey(PRIVATE_KEY, () => {
  ee.initialize();
  console.log('Google Earth Engine initialized');
});

const MODIS = ee.ImageCollection('MODIS/006/MOD13A2');

// Filter the image collection to a specific date range
const ndvi = MODIS.filterDate('2024-01-01', '2024-01-31').select('NDVI').mean(); // Calculate the mean NDVI for the given date range
