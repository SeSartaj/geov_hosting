import MyModal from '../../ui-components/MyModal';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { PlotContext } from '../../contexts/PlotContext';
import Input from '@/ui-components/Input';
import FormGroup from '@/ui-components/FormGroup';
import MyReactSelect from '@/ui-components/MyReactSelect';
import { createFarm, getFarmOptions } from '@/api/farmApi';
import Card from '@/ui-components/Card';
import { Button } from '../ui/button';
import useMapStore, { VIEW_MODES } from '@/stores/mapStore';
import { MarkersContext } from '@/contexts/markersContext';
import getSelectedValues from '@/utils/getSelectedValues';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';

const AddFarmModal = () => {
  const [open, setOpen] = useState(true);
  const { mapRef } = useContext(MapContext);
  const setViewMode = useMapStore((state) => state.setViewMode);
  const intl = useIntl();

  const handleClose = () => {
    console.log('closing modal');
    setViewMode(VIEW_MODES.NORMAL);
    setOpen(false);
  };

  const handleFarmCreation = (formValues) => {
    createFarm(formValues.name, formValues.marker_set).then((res) => {
      console.log('farm created successfully');
      toast(intl.formatMessage({ id: 'app.agviewer_map.farm_success_message', defaultMessage: 'Farm Has been created successfully' }), {
        description: `name: ${formValues.name}`,
      });
    });
    handleClose();
  };

  return (
    <MyModal
      title={intl.formatMessage({ id: 'app.agviewer_map.add_new_farm', defaultMessage: "Add New Farm" })}
      headerClassName="m-4"
      open={open}
      setOpen={setOpen}
      onChange={handleClose}
      portalContainer={
        mapRef?.current
          ? mapRef?.current?.getMap().getContainer()
          : document.body
      }
    >
      <div className="h-[400px] overflow-y-auto">
        <FarmForm onClose={handleClose} onSubmit={handleFarmCreation} />
      </div>
    </MyModal>
  );
};

function FarmForm({ onClose, onSubmit }) {
  const formRef = useRef();
  const intl = useIntl();

  const { markers, loading: markersLoading } = useContext(MarkersContext);

  const markerOptions = useMemo(
    () =>
      markers.map((marker) => ({
        value: marker.id,
        label: marker?.name || marker?.title || marker?.label,
      })),
    [markers]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [farmMarkers, setFarmMarkers] = useState([]);

  let selectedMarkersValue = useMemo(
    () => getSelectedValues(farmMarkers, markerOptions),
    [farmMarkers, markerOptions]
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name: name, marker_set: farmMarkers });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="p-4 flex flex-col h-full"
      ref={formRef}
    >
      <FormGroup label={intl.formatMessage({ id: 'app.agviewer_map.name', defaultMessage: 'Name' })}>
        <Input
          type="text"
          name="name"
          className="w-full sm:max-w-[483px] max-w-[227px]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormGroup>
      <FormGroup label={intl.formatMessage({ id: 'app.agviewer_map.markers', defaultMessage: "Markers" })}>
        <MyReactSelect
          formRef={formRef}
          className="w-full sm:max-w-[483px] max-w-[227px]"
          name="marker_set"
          value={selectedMarkersValue}
          onChange={setFarmMarkers}
          options={markerOptions}
          isMulti={true}
          isClearable={true}
          isLoading={markersLoading}
          isSearchable={true}
          closeMenuOnSelect={false}
        />
      </FormGroup>
      <div className="mt-5 flex gap-2  mt-auto self-end">
        <Button
          type="cancel"
          variant="outline"
          onClick={!isLoading && onClose}
          disabled={isLoading}
        >
          {intl.formatMessage({ id: 'app.agviewer_map.cancel', defaultMessage: "Cancel" })}
        </Button>
        <Button type="submit" color="primary">
          {intl.formatMessage({ id: 'app.agviewer_map.add_farm', defaultMessage: "Add Farm" })}
        </Button>
      </div>
    </form>
  );
}

export default AddFarmModal;
