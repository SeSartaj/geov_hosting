import { BiPencil } from 'react-icons/bi';
import { useCallback, useContext, useState } from 'react';
import { MarkersContext } from '../../contexts/markersContext';
import MarkerForm from '@/forms/MarkerForm';
import MyButton from '@/ui-components/MyButton';
import MyModal from '@/ui-components/MyModal';
import Card from '@/ui-components/Card';
import Tooltip from '@/ui-components/Tooltip';

const EditMarkerModal = ({ marker, markerId, buttonClassName = '' }) => {
const EditMarkerModal = ({ marker, markerId }) => {
  const [open, setOpen] = useState(false);
  const { handleMarkerUpdate } = useContext(MarkersContext);

  const _onChangeVisibility = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handlerEditMarker = (data) => {
    return handleMarkerUpdate(data);
  };

  return (
    <MyModal
      trigger={
        <MyButton variant="icon" className={`rounded-full ${buttonClassName}`}>
          <Tooltip text="click to edit the marker">
            <BiPencil className="w-5 h-5 action-icon" />
          </Tooltip>
        </MyButton>
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
