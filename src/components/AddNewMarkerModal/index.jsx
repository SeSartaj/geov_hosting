import './styles.css';
import MyModal from '../../ui-components/MyModal';
import MyButton from '../../ui-components/MyButton';
import { useContext, useEffect, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { MarkersContext } from '../../contexts/markersContext';
import { BiPin } from 'react-icons/bi';
import Input from '@/ui-components/Input';
import MyReactSelect from '@/ui-components/MyReactSelect';
import FormGroup from '@/ui-components/FormGroup';
import { getFarmOptions } from '@/api/farmApi';
import { getStationOptions } from '@/api/stationApi';
import { getAllGraphOptions, getPawGraphOptions } from '@/api/graphsApi';
import { SettingsContext } from '@/contexts/SettingsContext';
import useAsync from '@/hooks/useAsync';
import ToggleButton from '@/ui-components/toggleButton';
import MarkerForm from '@/forms/MarkerForm';

const AddNewMarkerModal = ({ feature, deleteFeature }) => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const { addNewMarker } = useContext(MarkersContext);

  const initialValues = {
    longitude: feature?.geometry?.coordinates[0],
    latitude: feature?.geometry?.coordinates[1],
  }


  const handleClose = () => {
    deleteFeature();
    setOpen(false);
  };

  const handleNewMarkerCreation = (formData) => {
    addNewMarker(formData);
    deleteFeature();
    handleClose();
  };




  return (
    <MyModal
      trigger={
        <MyButton color="primary">
          <BiPin /> Add New Marker
        </MyButton>
      }
      title='Add New Marker'
      headerClassName='m-4'
      description='add a new marker to the map'
      open={open}
      setOpen={setOpen}
      portalContainer={
        mapRef?.current
          ? mapRef?.current?.getMap().getContainer()
          : document.body
      }
      onClose={handleClose}
    >
      <MarkerForm initialValues={initialValues} onSubmit={handleNewMarkerCreation} onCancel={handleClose}/>
    </MyModal>
  );
};

export default AddNewMarkerModal;
