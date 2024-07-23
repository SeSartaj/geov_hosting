import * as Dialog from '@radix-ui/react-dialog';
import './styles.css';
import { BiX } from 'react-icons/bi';
import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { fromJS } from 'immutable';

const AddNewLayerModal = ({ setSources }) => {
  const [open, setOpen] = useState(false);
  const { mapStyle, setMapStyle, mapRef } = useContext(MapContext);
  const [url, setUrl] = useState(typeof mapStyle === 'string' ? mapStyle : '');

  const mapInstance = mapRef.current.getMap();

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleStyleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const newMapStyle = fromJS(JSON.parse(event.target.result));
      setMapStyle(newMapStyle);
      setOpen(false);
    };

    reader.readAsText(file);
  };
  const handleAddLayer = (e) => {
    // write adding layer code here
    // add a layer from geojson url

    // add layer
    mapInstance?.addLayer({
      id: 'earthquake-layer',
      type: 'circle',
      source: 'earthquakes',
    });

    return;
  };

  console.log('sources', mapInstance.getStyle()?.sources);

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
          <select name='source' id='source'>
            {Object.keys(mapInstance.getStyle()?.sources).map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}{' '}
          </select>

          <p>Name</p>
          <input
            type='text'
            style={{ fontSize: 20, padding: 5 }}
            name='name'
            className='Input'
          />

          <p>type</p>
          <select>
            <option value='fill'>Fill</option>
            <option value='polygon'>polygon</option>
            <option value='line'>line</option>
            <option value='point'>point</option>
          </select>

          <p>Color</p>
          <input type='color' name='color' id='color' />

          <p>stroke</p>

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
