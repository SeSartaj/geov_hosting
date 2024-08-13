import { API_URL } from '@/constants';
import { fetchWrapper } from '@/utils/fetchWrapper';

export const getMapSettings = async () => {
  console.log('fetching map settings');
  const response = await fetchWrapper(`${API_URL}map/primary/`);
  return response.json();
};
