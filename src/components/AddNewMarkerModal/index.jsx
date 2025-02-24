import './styles.css';
import MyModal from '../../ui-components/MyModal';
import MyButton from '../../ui-components/MyButton';
import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { MarkersContext } from '../../contexts/markersContext';
import { BiPin } from 'react-icons/bi';
import MarkerForm from '@/forms/MarkerForm';
import Card from '@/ui-components/Card';
import { useIntl } from 'react-intl';

const AddNewMarkerModal = ({ feature, deleteFeature, trigger }) => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const { addNewMarker } = useContext(MarkersContext);
  const intl = useIntl();

  const initialValues = {
    longitude: feature?.geometry?.coordinates[0],
    latitude: feature?.geometry?.coordinates[1],
  };

  console.log('feature', feature);
  const handleClose = () => {
    deleteFeature();
    setOpen(false);
  };

  const handleNewMarkerCreation = (formData) => {
    addNewMarker(formData);
    deleteFeature();
    handleClose();
  };

  console.log('initialValues', initialValues);

  return (
    <MyModal
      trigger={
        trigger || (
          <MyButton color="primary">
            <BiPin /> {intl.formatMessage({ id: 'app.agviewer_map.add_new_marker', defaultMessage: "Add New Marker" })}
          </MyButton>
        )
      }
      title={intl.formatMessage({ id: 'app.agviewer_map.add_new_marker', defaultMessage: "Add New Marker" })}
      headerClassName="m-4"
      // description="add a new marker to the map"
      open={open}
      setOpen={setOpen}
      onClose={handleClose}
    >
      <Card>
        <MarkerForm
          initialValues={initialValues}
          onSubmit={handleNewMarkerCreation}
          onCancel={handleClose}
        />
      </Card>
    </MyModal>
  );
};

export default AddNewMarkerModal;
