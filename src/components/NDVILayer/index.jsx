import { NDVI_LAYER_URL } from '@/api/sentinalHubApi';
import { Source, Layer } from 'react-map-gl/maplibre';

const NDVILayer = () => {
  return (
    <Source
      id='ndvi-source'
      type='raster'
      tiles={[NDVI_LAYER_URL]}
      tileSize={256}
      minzoom={0}
      maxzoom={16}
    >
      <Layer
        id='ndvi-layer'
        type='raster'
        source='ndvi-source'
        paint={{ 'raster-opacity': 1 }}
      />
    </Source>
  );
};

export default NDVILayer;
