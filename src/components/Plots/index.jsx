import { useContext } from 'react';
import { PlotContext } from '../../contexts/PlotContext';
import { Source, Layer } from 'react-map-gl/maplibre';

export default function Plots() {
  const { plots, setClickedPlot } = useContext(PlotContext);

  const layerStyle = {
    id: 'plots-layer',
    type: 'fill',
    paint: {
      'fill-color': '#0080ff', // Plot fill color
      'fill-opacity': 0.5,
    },
  };

  return (
    <Source
      id='plots'
      type='geojson'
      data={{ type: 'FeatureCollection', features: plots }}
    >
      <Layer {...layerStyle} />
    </Source>
  );
}
