import useMapStore from '@/stores/mapStore';

export const fetchWrapper = (url, options = {}) => {
  let requestHeaders = useMapStore.getState().requestHeaders || {};
  console.log('requestHeaders', requestHeaders);
  if (!requestHeaders?.Authorization) {
    // Get username and password from Vite environment variables
    const username = import.meta.env.VITE_AGV_API_USERNAME;
    const password = import.meta.env.VITE_AGV_API_PASSWORD;
    console.log('username and password', username, password);

    if (username && password) {
      const encodedCredentials = btoa(`${username}:${password}`);
      requestHeaders.Authorization = `Basic ${encodedCredentials}`;
      console.log('using environment variable for username and password');
    }
  }

  const headers = {
    ...requestHeaders,
    ...options?.headers,
  };
  console.log('headers', headers);
  return fetch(url, { ...options, headers }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response;
  });
};
