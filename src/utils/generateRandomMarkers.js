// may be used for (load) testing
import { getRandomItem } from './getRandomItem';

export function generateRandomMarkers(numMarkers) {
  const markers = [];

  for (let i = 0; i < numMarkers; i++) {
    const marker = {
      id: `marker${i + 1}`,
      longitude: (Math.random() * 180 - 90).toFixed(4), // Random longitude between -90 and +90
      latitude: (Math.random() * 180 - 90).toFixed(4), // Random latitude between -90 and +90
      title: `Marker ${i + 1}`,
      description: `This is marker ${i + 1}`,
      color: getRandomItem(['green', 'red', 'orange']),
      battery: Math.floor(Math.random() * 100),
      crop: getRandomItem(['corn', 'wheat', 'soybean', 'rice', 'potato']),
      avg_paw: (Math.random() * 100).toFixed(2),
      api: getRandomItem(['Zentra', 'Fieldclimate']),
      farm: getRandomItem([
        { id: 1, name: 'Farm 1' },
        { id: 2, name: 'Farm 2' },
      ]),
    };
    markers.push(marker);
  }

  return markers;
}
