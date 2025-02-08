import { API_URL, API_URL2 } from '@/constants';
import { fetchWrapper } from '@/utils/fetchWrapper';

export const getStationOptions = async () => {
  console.log('fetching farms');
  const response = await fetchWrapper(`${API_URL}station`);
  const data = await response.json();
  console.log('response', data);
  return data.map((f) => ({ value: f.serial, label: f.name })) || [];
};

export const TurnOnSatET = (stationId) => {
  console.log('Turning on sat-et for station', stationId);

  return fetchWrapper(`${API_URL2}/stations/${stationId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enable_satellite_et: true }),
  })
    .then((res) => {
      console.log('Response:', res);
      return res.json();
    })
    .catch((err) => {
      console.error('Error:', err);
    });
};

export const TurnOffSatET = (stationId) => {
  console.log('Turning off sat-et for station', stationId);

  return fetchWrapper(`${API_URL2}/stations/${stationId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enable_satellite_et: false }),
  })
    .then((res) => {
      console.log('Response:', res);
      return res.json();
    })
    .catch((err) => {
      console.error('Error:', err);
    });
};
