const base64Credentials = btoa(`demo:demo`);

export const fetchWrapper =  (url, options = {}) => {
  const headers = {
    Authorization: `Basic ${base64Credentials}`,
    ...options?.headers,
  };
  return fetch(url, { ...options, headers }).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response;
    })
}

