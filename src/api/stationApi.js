import { API_URL } from '@/constants';
import { fetchWrapper } from '@/utils/fetchWrapper';

export const getStationOptions = async () => {
  console.log('fetching farms');
  const response = await fetchWrapper(`${API_URL}station`);
  const data = await response.json();
  console.log('response', data);
  return data.map((f) => ({ value: f.serial, label: f.name })) || [];
};
