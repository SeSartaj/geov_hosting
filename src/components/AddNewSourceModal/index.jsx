import * as Dialog from '@radix-ui/react-dialog';
import './styles.css';
import { BiX } from 'react-icons/bi';
import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';

const AddNewSourceModal = ({ setSources }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [fileContent, setFileContent] = useState();
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const [url, setUrl] = useState('');

  const map = mapRef.current.getMap();

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleFileChange = (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const source = JSON.parse(event.target.result);
      // add source from file content
      setFileContent(source);
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleAddSource = () => {
    const data = url ? url : fileContent;
    map.addSource(name, {
      type: 'geojson',
      data: data,
    });
    setSources(map.getStyle()?.sources);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className='Button violet'>Add New Source</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className='DialogContent'>
          <Dialog.Title className='DialogTitle'>
            Add New GeoJSON Source
          </Dialog.Title>
          <Dialog.Description className='DialogDescription'>
            You can add a new source from a GeoJSON url or a file upload
          </Dialog.Description>
          <input
            type='text'
            style={{ fontSize: 20, padding: 5, marginBottom: 5 }}
            placeholder='Source Name'
            name='name'
            className='Input'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type='text'
            style={{ fontSize: 20, padding: 5 }}
            placeholder='paste style url here'
            name='style_url'
            className='Input'
            value={url}
            onChange={handleUrlChange}
          />
          <p>Or upload a file</p>
          <input
            type='file'
            style={{ fontSize: 20, padding: 5 }}
            name='style_file'
            className='Input'
            onChange={handleFileChange}
          />
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
              <button
                className='Button green'
                onClick={handleAddSource}
                disabled={isLoading}
              >
                Add New Source
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

export default AddNewSourceModal;
