import { PlotContext } from '@/contexts/PlotContext';
import { useContext } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';

export default function PlotNdvi() {
  const { plots } = useContext(PlotContext);
  const ndviLayerStyle = {
    id: 'ndvi-layer',
    type: 'raster',
    source: 'ndvi',
    paint: {
      'raster-opacity': 0.7,
    },
  };

  // Add this in your render method or component
  return (
    <>
      {plots.map((plot, index) => {
        return (
          <Source
            id={`ndvi-${index}`}
            key={plot.id}
            type='raster'
            tiles={[plot.ndviUrl]}
            tileSize={512}
          >
            <Layer {...ndviLayerStyle} />
          </Source>
        );
      })}
    </>
  );
}
