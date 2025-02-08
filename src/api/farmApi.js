import { API_URL, API_URL2 } from '@/constants';
import { fetchWrapper } from '@/utils/fetchWrapper';

export const getFarmOptions = async () => {
  console.log('fetching farms');
  const response = await fetchWrapper(`${API_URL}farm`);
  const data = await response.json();
  return data.map((f) => ({ value: f.id, label: f.name })) || [];
};

export const createFarm = async (name, markerSet) => {
  console.log('Creating a new farm...');
  const response = await fetchWrapper(`${API_URL2}/dashboard/farm/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      marker_set: markerSet.map((marker) => ({ id: marker.value })),
    }),
  });
  return response.json();
};

export const updateFarm = async (farmId, name, markerSet) => {
  console.log(`Updating farm ${farmId}...`);
  const response = await fetchWrapper(`${API_URL}farm/${farmId}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      marker_set: markerSet.map((marker) => ({ id: marker.value })),
    }),
  });
  return response.json();
};

export const deleteFarm = async (farmId) => {
  console.log(`Deleting farm ${farmId}...`);
  await fetchWrapper(`${API_URL}farm/${farmId}/`, { method: 'DELETE' });
};
