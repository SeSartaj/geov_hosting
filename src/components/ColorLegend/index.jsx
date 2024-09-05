import useMapStore from '@/stores/mapStore';
import './styles.css'; // Create a separate CSS file to style the legend

const NDVI_Legend = [
  { color: '#004400', label: ' (0.5 to 1.0)' }, // Dark Green
  { color: '#0f540a', label: ' (0.4 to 0.5)' }, // Very Dark Green
  { color: '#216011', label: ' (0.35 to 0.4)' }, // Dark Green
  { color: '#306d1c', label: ' (0.3 to 0.35)' }, // Dark Green
  { color: '#3f7c23', label: ' (0.25 to 0.3)' }, // Medium Green
  { color: '#4f892d', label: ' (0.2 to 0.25)' }, // Medium Green
  { color: '#609635', label: ' (0.15 to 0.2)' }, // Medium Green
  { color: '#70a33f', label: ' (0.1 to 0.15)' }, // Light Green
  { color: '#7fb247', label: ' (0.05 to 0.1)' }, // Light Green
  { color: '#91bf51', label: ' (0.025 to 0.05)' }, // Light Green
  { color: '#a3cc59', label: ' (0.0 to 0.025)' }, // Light Green
  { color: '#bcb76b', label: ' (-0.1 to 0.0)' }, // Pale Green
  { color: '#ccc682', label: ' (-0.2 to -0.1)' }, // Pale Green
  { color: '#ddd89b', label: ' (-0.25 to -0.2)' }, // Very Light Green
  { color: '#ede8b5', label: ' (-0.3 to -0.25)' }, // Very Light Green
  { color: '#fff9cc', label: ' (-0.35 to -0.3)' }, // Pale Yellow
  { color: '#eaeaea', label: ' (-0.4 to -0.35)' }, // Pale Gray
  { color: '#dbdbdb', label: ' (-0.5 to -0.4)' }, // Gray
  { color: '#bfbfbf', label: ' (-0.6 to -0.5)' }, // Light Gray
  { color: '#c0c0c0', label: ' (-0.7 to -0.6)' }, // Light Gray
  { color: '#0c0c0c', label: ' (-1.0 to -0.7)' }, // Dark Gray
];

const Agriculture_Legend = [
  { color: '#ffffcc', label: 'Bare Soil' },
  { color: '#c7e9b4', label: 'Low Vegetation' },
  { color: '#7fcdbb', label: 'Moderate Vegetation' },
  { color: '#41b6c4', label: 'Healthy Vegetation' },
  { color: '#1d91c0', label: 'Very Healthy Vegetation' },
  { color: '#225ea8', label: 'Dense Vegetation' },
  { color: '#0c2c84', label: 'Water Bodies' },
];

const FalseColor_Legend = [
  { color: '#f8d5cc', label: 'Bare Soil' },
  { color: '#d73027', label: 'Low Vegetation' },
  { color: '#f46d43', label: 'Sparse Vegetation' },
  { color: '#66bd63', label: 'Moderate Vegetation' },
  { color: '#1a9850', label: 'Healthy Vegetation' },
  { color: '#542788', label: 'Water' },
];

const MoistureIndex_Legend = [
  { color: '#a50026', label: 'Very Dry' },
  { color: '#d73027', label: 'Dry' },
  { color: '#f46d43', label: 'Moderate Moisture' },
  { color: '#fdae61', label: 'High Moisture' },
  { color: '#fee08b', label: 'Very High Moisture' },
  { color: '#d9ef8b', label: 'Saturated' },
  { color: '#66bd63', label: 'Water Body' },
];

const ColorLegend = () => {
  const rasterLayer = useMapStore((state) => state.rasterLayer);
  const pixelColor = useMapStore((state) => state.pixelColor);

  console.log('rasterLayer', rasterLayer);
  let items;
  switch (rasterLayer?.value) {
    case 'NDVI':
      items = NDVI_Legend;
      break;
    case 'AGRICULTURE':
      items = Agriculture_Legend;
      break;
    case 'FALSE-COLOR':
      items = FalseColor_Legend;
      break;
    case 'MOISTURE-INDEX':
      items = MoistureIndex_Legend;
      break;
  }

  if (!items || !pixelColor) return null;

  const item = items.find((i) => i.color == pixelColor);
  console.log('item', item);
  return (
    <div className='legend'>
      <h4>{rasterLayer?.value}</h4>
      {items.map((item, index) => (
        <div key={index} className='legend-item'>
          <span
            className='legend-color'
            style={{ backgroundColor: item.color }}
          ></span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ColorLegend;
