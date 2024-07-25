import * as Dialog from '@radix-ui/react-dialog';
import './styles.css';
import { BiX } from 'react-icons/bi';
import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { fromJS } from 'immutable';

const AddNewLayerModal = ({ setSources, setLayers }) => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);

  const [layerSource, setLayerSource] = useState();
  const [type, setType] = useState('polygon');

  const mapInstance = mapRef.current.getMap();

  const handleAddLayer = (e) => {
    const mapInstance = mapRef.current.getMap();
    mapInstance.addLayer({
      id: layerSource + `-${type}`,
      type: type,
      source: layerSource,
      layout: {
        visibility: 'visible',
      },
      paint: DEFAULT_PAINTS[type],
      filter: ['==', '$type', LAYER_TYPE_GEOMETRY[type]],
    });
    setLayers(mapRef.current.getStyle().layers);
  };

  const DEFAULT_PAINTS = {
    fill: {
      'fill-color': 'green',
      'fill-opacity': 0.8,
    },
    line: {
      'line-color': 'blue',
      'line-width': 2,
      'line-opacity': 0.8,
    },
    circle: {
      'circle-radius': 5,
      'circle-color': 'red',
      'circle-opacity': 0.8,
    },
    symbol: {
      'text-color': 'black',
      'text-halo-color': 'white',
      'text-halo-width': 2,
      'text-opacity': 1.0,
    },
    'fill-extrusion': {
      'fill-extrusion-color': 'gray',
      'fill-extrusion-height': 10,
      'fill-extrusion-opacity': 0.8,
    },
    heatmap: {
      'heatmap-radius': 30,
      'heatmap-opacity': 0.8,
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'blue',
        0.5,
        'lime',
        1,
        'red',
      ],
    },
    raster: {
      'raster-opacity': 1.0,
      'raster-brightness-min': 0,
      'raster-brightness-max': 1,
      'raster-contrast': 0,
      'raster-saturation': 0,
    },
    hillshade: {
      'hillshade-exaggeration': 0.5,
      'hillshade-shadow-color': '#000000',
      'hillshade-highlight-color': '#FFFFFF',
      'hillshade-accent-color': '#0000FF',
    },
    background: {
      'background-color': 'white',
      'background-opacity': 1.0,
    },
  };

  const LAYER_TYPES = [
    'background',
    'fill',
    'line',
    'symbol',
    'raster',
    'circle',
    'fill-extrusion',
    'heatmap',
    'hillshade',
  ];

  const LAYER_TYPE_GEOMETRY = {
    fill: 'Polygon',
    line: 'LineString',
    symbol: 'Point',
    raster: 'Raster',
    circle: 'Point',
    'fill-extrusion': 'Polygon',
    heatmap: 'Point',
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className='Button violet'>Add a Layer</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className='DialogContent'>
          <Dialog.Title className='DialogTitle'>Add a Layer</Dialog.Title>
          {/* <Dialog.Description className='DialogDescription'>
            You can add a new layer from a GeoJSON url or a file upload
          </Dialog.Description> */}
          {/* <p>define your layer using json</p>
          <textarea name='layer' id='layer' cols='30' rows='10'></textarea> */}

          <p>Source</p>
          <select
            name='source'
            id='source'
            value={layerSource}
            onChange={(e) => setLayerSource(e.target.value)}
          >
            {Object.keys(mapInstance.getStyle()?.sources).map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}{' '}
          </select>

          <p>Type</p>
          <select
            name='type'
            id='type'
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {LAYER_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}{' '}
          </select>

          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end',
            }}
          >
            <Dialog.Close asChild>
              <button className='Button'>Cancel</button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button className='Button green' onClick={handleAddLayer}>
                Add New Layer
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className='IconButton CloseButton' aria-label='Close'>
              <BiX />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddNewLayerModal;
