const base64Credentials = btoa(`demo:demo`);

export const fetchWrapper = async (
  url,
  options = {
    headers: {
      Authorization: `Basic ${base64Credentials}`,
    },
  }
) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
