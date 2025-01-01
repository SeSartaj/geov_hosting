import { BiPencil } from 'react-icons/bi';
import { useCallback, useContext, useState } from 'react';
import { MarkersContext } from '../../contexts/markersContext';
import MarkerForm from '@/forms/MarkerForm';
import MyButton from '@/ui-components/MyButton';
import MyModal from '@/ui-components/MyModal';
import Card from '@/ui-components/Card';
import Tooltip from '@/ui-components/Tooltip';
import { Button } from '../ui/button';

const EditMarkerModal = ({ marker, markerId, buttonClassName = '' }) => {
  const [open, setOpen] = useState(false);
  const { handleMarkerUpdate } = useContext(MarkersContext);

  const _onChangeVisibility = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handlerEditMarker = (data) => {
    // check which fields has changed and send only those to the backend
    console.log('data after editing', data);
    console.log('data before editing', marker);

    return handleMarkerUpdate(data);
  };

  return (
    <MyModal
      trigger={
        <Button variant="outline" size="icon">
          <Tooltip text="edit the marker">
            <BiPencil className="w-5 h-5 action-icon" />
          </Tooltip>
        </Button>
      }
      title="Edit Marker"
      open={open}
      setOpen={setOpen}
      headerClassName="m-4"
      onClose={_onChangeVisibility}
    >
      <Card>
        <MarkerForm
          marker={marker}
          onSubmit={handlerEditMarker}
          onCancel={_onChangeVisibility}
          submitButtonText="Save Changes"
        />
      </Card>
    </MyModal>
  );
};

export default EditMarkerModal;
