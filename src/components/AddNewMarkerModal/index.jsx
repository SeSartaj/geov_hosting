import './styles.css';
import MyModal from '../../ui-components/MyModal';
import MyButton from '../../ui-components/MyButton';
import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { MarkersContext } from '../../contexts/markersContext';
import { BiPin } from 'react-icons/bi';
import Input from '@/ui-components/Input';
import InlineInputField from '@/ui-components/InlineInputField';

const AddNewMarkerModal = ({ feature }) => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const { markers, addNewMarker } = useContext(MarkersContext);

  const handleNewMarkerCreation = (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formData = new FormData(e.target);

    // Get all form values
    const name = formData.get('name');
    const description = formData.get('description');
    const longitude = formData.get('longitude');
    const latitude = formData.get('latitude');

    console.log('lat', latitude, 'long', longitude);

    // Create a new marker object
    const newMarker = {
      name: name,
      description,
      longitude: feature?.geometry?.coordinates[0],
      latitude: feature?.geometry?.coordinates[1],
    };

    console.log('newMarker', newMarker);
    addNewMarker(newMarker);

    setOpen(false);
  };

  return (
    <MyModal
      trigger={
        <MyButton>
          <BiPin /> Add New Marker
        </MyButton>
      }
      title='Add New Marker'
      description='add new marker to the map'
      open={open}
      setOpen={setOpen}
      portalContainer={
        mapRef?.current
          ? mapRef?.current?.getMap().getContainer()
          : document.body
      }
    >
      <form onSubmit={handleNewMarkerCreation}>
        <div className='flex flex-col gap-1'>
          <InlineInputField label='name:'>
            <Input type='text' name='name' />
          </InlineInputField>
          <InlineInputField label='description:'>
            <Input type='text' name='description' />
          </InlineInputField>
          <InlineInputField label='latitude:'>
            <Input
              value={feature?.geometry?.coordinates[1].toFixed(7)}
              type='number'
              name='latitude'
              step='any'
              disabled
            />
          </InlineInputField>
          <InlineInputField label='longitude:'>
            <Input
              value={feature?.geometry?.coordinates[0].toFixed(7)}
              type='number'
              name='longitude'
              step='any'
              disabled
            />
          </InlineInputField>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <MyButton variant='text' onClick={() => setOpen(false)}>
            cancel
          </MyButton>
          <MyButton type='submit'>Add Marker</MyButton>
        </div>
      </form>
    </MyModal>
  );
};

export default AddNewMarkerModal;
