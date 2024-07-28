import * as Dialog from '@radix-ui/react-dialog';
import './styles.css';
import { BiX } from 'react-icons/bi';
import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { fromJS } from 'immutable';
import MyButton from '../../ui-components/MyButton';

const AddNewStyleModal = () => {
  const [open, setOpen] = useState(false);
  const { mapStyle, setMapStyle } = useContext(MapContext);
  const [styleUrl, setStyleUrl] = useState(
    typeof mapStyle === 'string' ? mapStyle : ''
  );

  const handleUrlChange = (e) => {
    setStyleUrl(e.target.value);
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
  const handleStyleChange = (e) => {
    // change
    setMapStyle(styleUrl);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <MyButton>Add Map Style</MyButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className='DialogContent'>
          <Dialog.Title className='DialogTitle'>
            Add Custom Map Style
          </Dialog.Title>
          <Dialog.Description className='DialogDescription'>
            Style url can be a mapbox style URL or a style.json using the Mapbox
            GL Style Spec
          </Dialog.Description>
          <input
            type='text'
            style={{ fontSize: 20, padding: 5 }}
            placeholder='paste style url here'
            name='style_url'
            className='Input'
            value={styleUrl}
            onChange={handleUrlChange}
          />
          <p>Or upload a file</p>
          <input
            type='file'
            style={{ fontSize: 20, padding: 5 }}
            name='style_file'
            className='Input'
            onChange={handleStyleFileChange}
          />
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end',
            }}
          >
            <Dialog.Close asChild>
              <MyButton size='sm' color='mute'>
                Cancel
              </MyButton>
            </Dialog.Close>
            <Dialog.Close asChild>
              <MyButton onClick={handleStyleChange} size='sm'>
                Add Style
              </MyButton>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            {/* <button className='IconButton CloseButton' aria-label='Close'>
              <BiX />
            </button> */}
            <MyButton
              color='mute'
              variant='icon'
              style={{ position: 'absolute', top: 10, right: 10 }}
              aria-label='Close'
            >
              <BiX />
            </MyButton>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddNewStyleModal;
