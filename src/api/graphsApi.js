import { API_URL, API_URL2 } from '@/constants';
import { fetchWrapper } from '@/utils/fetchWrapper';

export const getPawGraphOptions = async () => {
  console.log('fetching farms');
  const response = await fetchWrapper(`${API_URL2}/allgraphs/?graph_type=paw`);
  const data = await response.json();
  console.log('response', data);
  return (
    data.map((f) => ({
      value: f.id,
      label: `${f.label} [${f.calculation}]`,
    })) || []
  );
};

export const getAllGraphOptions = async () => {
  console.log('fetching farms');
  const response = await fetchWrapper(`${API_URL2}/allgraphs/`);
  const data = await response.json();
  console.log('response', data);
  return (
    data.map((f) => ({
      value: f.id,
      label: `${f.label} [${f.calculation}]`,
    })) || []
  );
};
