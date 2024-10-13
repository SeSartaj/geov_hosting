import MyModal from '../../ui-components/MyModal';
import MyButton from '../../ui-components/MyButton';
import { useContext, useEffect, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { MarkersContext } from '../../contexts/markersContext';
import { BiPencil, BiPin } from 'react-icons/bi';
import { SettingsContext } from '@/contexts/SettingsContext';
import MarkerForm from '@/forms/MarkerForm';
import { getMarkerById, updateMarker } from '@/api/markerApi';

const EditMarkerModal = ({ marker, markerId }) => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const { handleMarkerUpdate } = useContext(MarkersContext);


  const handleClose = () => {
    setOpen(false);
  };

  const handlerEditMarker = (data) => {
    console.log("marker edited", data)
    return handleMarkerUpdate(data);
  }

  return (
    <MyModal
      trigger={
        <span >
            <BiPencil className='action-icon' />
        </span>
      }
      title='Edit Marker'
      headerClassName='m-4'
      description='make changes and click "save changes" to apply changes'
      open={open}
      setOpen={setOpen}
      portalContainer={
        mapRef?.current
          ? mapRef?.current?.getMap().getContainer()
          : document.body
      }
      onClose={handleClose}
    >
      <MarkerForm marker={marker} onSubmit={handlerEditMarker} onCancel={handleClose} submitButtonText="Save Changes"/>
    </MyModal>
  );
};

export default EditMarkerModal;
