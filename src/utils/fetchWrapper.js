const base64Credentials = btoa(`demo:demo`);

export const fetchWrapper = async (url, options = {}) => {
  const headers = {
    Authorization: `Basic ${base64Credentials}`,
    ...options?.headers,
  };

  console.log('options from fetchWrapper', options);
  console.log('headers', headers);

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
