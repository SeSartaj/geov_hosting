import * as Dialog from '@radix-ui/react-dialog';
import './styles.css';
import { BiX } from 'react-icons/bi';
import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { fromJS } from 'immutable';

const AddNewLayerModal = ({ setSources }) => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);

  const [layerSource, setLayerSource] = useState();

  const mapInstance = mapRef.current.getMap();

  const handleAddLayer = (e) => {
    const mapInstance = mapRef.current.getMap();
    mapInstance.addLayer({
      id: layerSource + '-polygon',
      type: 'fill',
      source: layerSource,
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'Obesity'],
          15,
          'green',
          40,
          'red',
        ],
        'fill-opacity': 0.8,
      },
      filter: ['==', '$type', 'Polygon'],
    });
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
