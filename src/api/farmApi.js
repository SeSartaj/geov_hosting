import { API_URL } from '@/constants';
import { fetchWrapper } from '@/utils/fetchWrapper';

export const getFarmOptions = async () => {
  console.log('fetching farms');
  const response = await fetchWrapper(`${API_URL}farm`);
  const data = await response.json();
  return data.map((f) => ({ value: f.id, label: f.name })) || [];
};
