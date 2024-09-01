import { API_URL } from '@/constants';
import { fetchWrapper } from '../utils/fetchWrapper';

const DUMMY_PLOTS = [
  {
    id: 'lmvkmsdmweioldmfsk',
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [69.2084, 34.5553],
          [69.209, 34.5553],
          [69.209, 34.556],
          [69.2084, 34.556],
          [69.2084, 34.5553],
        ],
      ],
    },
    properties: {
      name: 'Plot 1',
      farm: 'Farm 1',
      id: 'lmvkmsdmweioldmfsk',
    },
  },
  {
    id: 'idskkaldmlvksdkds',
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [69.2094, 34.5553],
          [69.21, 34.5553],
          [69.21, 34.556],
          [69.2094, 34.556],
          [69.2094, 34.5553],
        ],
      ],
    },
    properties: {
      name: 'Plot 2',
      farm: 'Farm 1',
      id: 'idskkaldmlvksdkds',
    },
  },
  {
    id: 'kdkjsksksdladfd',
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [69.2104, 34.5553],
          [69.211, 34.5553],
          [69.211, 34.556],
          [69.2104, 34.556],
          [69.2104, 34.5553],
        ],
      ],
    },
    properties: {
      name: 'Plot 3',
      farm: 'Farm 1',
      id: '17cf8c98320sd177b926eew6',
    },
  },
  {
    id: 'adfasdfakksdk',
    type: 'Feature',
    properties: {
      id: 'lskjdfalsjflakdsjmmmn',
      name: 'plot 1 3',
      description: 'ksdkf',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-72.30484165371566, -40.08026576811746],
          [-72.29506559590199, -40.07979240065652],
          [-72.2926107806077, -40.083089622627874],
          [-72.30806030453363, -40.085650691709894],
          [-72.30788864315659, -40.07800003272502],
          [-72.30484165371566, -40.08026576811746],
        ],
      ],
    },
  },
  {
    id: 'd0a46521eead375d1f68b1',
    type: 'Feature',
    properties: {
      name: 'plot 23`ksd',
      description: 'ksd',
    },
    geometry: {
      coordinates: [
        [
          [69.19074392395714, 34.55366362657435],
          [69.19127770236099, 34.55366609768588],
          [69.19129320637583, 34.55356394534637],
          [69.19151026259922, 34.55355117629429],
          [69.19156194265193, 34.55270415817802],
          [69.19092627799861, 34.55273820932368],
          [69.1909159419881, 34.552878670153774],
          [69.1907195577858, 34.552891439308254],
          [69.19074392395714, 34.55366362657435],
        ],
      ],
      type: 'Polygon',
    },
  },
];

export const getPlots = async () => {
  const response = await fetchWrapper(`${API_URL}plot/`);
  const data = await response.json();
  return data;
  // return DUMMY_PLOTS;
};

export const createPlot = async (data) => {
  const response = await fetchWrapper(`${API_URL}plot/`, {
    method: 'POST',
    body: JSON.stringify(data),
    // set type to json
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return response.json();
  }
};

export const updatePlot = async (data) => {
  const response = await fetchWrapper(`${API_URL}plot/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    // set type to json
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return response.json();
  }
};

export const deletePlot = async (plotId) => {
  const response = await fetchWrapper(`${API_URL}plot/${plotId}/`, {
    method: 'DELETE',
  });

  if (response.ok) {
    return response.json();
  }
};

export const getPawData = async (markerId) => {
  const response = await fetchWrapper(`${API_URL}marker/paw/${markerId}/`);
  return response.json();
};

export const getStations = async () => {
  const response = await fetchWrapper(`${API_URL}station/`);
  return response.json();
};
