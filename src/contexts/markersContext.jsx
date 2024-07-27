import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Create a new context for the map
const MarkersContext = createContext();

function getRandomItem(arr) {
  if (arr.length === 0) return undefined; // Handle case for empty array
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function generateRandomMarkers(numMarkers) {
  const markers = [];

  for (let i = 0; i < numMarkers; i++) {
    const marker = {
      id: `marker${i + 1}`,
      longitude: (Math.random() * 180 - 90).toFixed(4), // Random longitude between -90 and +90
      latitude: (Math.random() * 180 - 90).toFixed(4), // Random latitude between -90 and +90
      title: `Marker ${i + 1}`,
      description: `This is marker ${i + 1}`,
      color: getRandomItem(['green', 'red', 'orange']),
    };
    markers.push(marker);
  }

  return markers;
}

const MarkersProvider = ({ children }) => {
  // in the future, fetch markers from the server
  const [markersData, setMarkersData] = useState(generateRandomMarkers(100));
  const [clickedMarker, setClickedMarker] = useState(null);

  return (
    <MarkersContext.Provider
      value={{ markersData, setMarkersData, clickedMarker, setClickedMarker }}
    >
      {children}
    </MarkersContext.Provider>
  );
};

MarkersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MarkersContext, MarkersProvider };
