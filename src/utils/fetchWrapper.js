const username = import.meta.env.VITE_AGV_API_USERNAME;
const password = import.meta.env.VITE_AGV_API_PASSWORD;

const base64Credentials = btoa(`${username}:${password}`);

export const fetchWrapper = (url, options = {}) => {
  const headers = {
    Authorization: `Basic ${base64Credentials}`,
    ...options?.headers,
  };
  return fetch(url, { ...options, headers }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response;
  });
};
