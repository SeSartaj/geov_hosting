import useMapStore from '@/stores/mapStore';

export const fetchWrapper = (url, options = {}) => {
  let requestHeaders = useMapStore.getState().requestHeaders || {};
  if (!requestHeaders?.Authorization) {
    // Get username and password from Vite environment variables
    const username = import.meta.env.VITE_AGV_API_USERNAME;
    const password = import.meta.env.VITE_AGV_API_PASSWORD;

    if (username && password) {
      const encodedCredentials = btoa(`${username}:${password}`);
      requestHeaders.Authorization = `Basic ${encodedCredentials}`;
    }
  }

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
