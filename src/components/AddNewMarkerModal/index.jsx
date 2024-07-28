import './styles.css';
import MyModal from '../../ui-components/MyModal';
import MyButton from '../../ui-components/MyButton';
import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { MarkersContext } from '../../contexts/markersContext';

const AddNewMarkerModal = () => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const { markersData, setMarkersData } = useContext(MarkersContext);

  const handleNewMarkerCreation = (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formData = new FormData(e.target);

    // Get all form values
    const name = formData.get('name');
    const description = formData.get('description');
    const longitude = formData.get('longitude');
    const latitude = formData.get('latitude');

    // Create a new marker object
    const newMarker = {
      id: name,
      title: name,
      description,
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    };

    console.log(newMarker);

    setMarkersData([...markersData, newMarker]);
    setOpen(false);
  };

  return (
    <MyModal
      trigger={<MyButton>Add New Marker</MyButton>}
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
        name: <input type='text' name='name' /> <br />
        description: <input type='text' name='description' /> <br />
        latitude: <input type='number' name='latitude' step='any' /> <br />
        longitude: <input type='number' name='longitude' step='any' /> <br />
        <br />
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
