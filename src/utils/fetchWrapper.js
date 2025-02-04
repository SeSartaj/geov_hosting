import useMapStore from '@/stores/mapStore';

export const fetchWrapper = (url, options = {}) => {
  const requestHeaders = useMapStore.getState().requestHeaders;

  const headers = {
    ...requestHeaders,
    ...options?.headers,
  };
  return fetch(url, { ...options, headers }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response;
  });
};
