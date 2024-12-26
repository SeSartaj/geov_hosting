import { getFarmOptions } from '@/api/farmApi';
import { getAllGraphOptions, getPawGraphOptions } from '@/api/graphsApi';
import { getStationOptions } from '@/api/stationApi';
import { SettingsContext } from '@/contexts/SettingsContext';
import useAsync from '@/hooks/useAsync';
import FormGroup, { FormErrorMessage } from '@/ui-components/FormGroup';
import Input from '@/ui-components/Input';
import MyButton from '@/ui-components/MyButton';
import MyReactSelect from '@/ui-components/MyReactSelect';
import Spinner from '@/ui-components/Spinner';
import ToggleButton from '@/ui-components/toggleButton';
import getSelectedValues from '@/utils/getSelectedValues';
import { useContext, useRef, useState } from 'react';

const emptyValues = {
  name: '',
  station: '',
  farm: '',
  paw_graphs: [],
  graphs: [],
  longitude: '',
  latitude: '',
};

export default function MarkerForm({
  onSubmit,
  onCancel,
  initialValues = {},
  marker,
  submitButtonText = 'Add Marker',
}) {
  const {
    data: farmOptions,
    status: farmStatus,
    error: farmError,
    run: fetchFarmOptions,
  } = useAsync(getFarmOptions, { data: [] });
  const {
    data: stationOptions,
    status: stationStatus,
    error: stationError,
  } = useAsync(getStationOptions, { data: [] });
  const {
    data: pawGraphOptions,
    status: pawGraphStatus,
    error: pawGraphError,
  } = useAsync(getPawGraphOptions, { data: [] });
  const {
    data: allGraphOptions,
    status: allGraphStatus,
    error: allGraphError,
  } = useAsync(getAllGraphOptions, { data: [] });

  const { settings } = useContext(SettingsContext);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState();

  const [customLocation, setCustomLocation] = useState(false);

  const formRef = useRef();

  const serializeData = (formData) => {
    const data = {
      marker_map: settings.mapId,
      lng: formData.longitude,
      lat: formData.latitude,
      location_name: formData.name,
      farm: formData.farm.value,
      use_custom_location: true,
    };

    if (formData?.id) data.id = formData.id;
    if (formData.station) data.device = formData.station.value;
    if (formData.graphs?.length > 0)
      data.graphs = formData.graphs.map((g) => g.value);
    if (formData.paw_graphs?.length > 0)
      data.graphs = formData.paw_graphs.map((g) => g.value);

    return data;
  };

  const deserializeData = (data) => {
    return {
      ...emptyValues,
      id: data.id,
      name: data.location_name,
      longitude: data.lng,
      latitude: data.lat,
      farm: data.farm,
      station: data.device,
      paw_graphs: data.paw_graphs,
      graphs: data.graphs,
      ...initialValues,
    };
  };

  const deserializedData = marker ? deserializeData(marker) : {};
  // if user doesn't include all values in initialValues, emptyValues will be used
  const [formData, setFormData] = useState({ ...deserializedData });

  const handleCustomCoordsToggling = (isCustomLocation) => {
    if (isCustomLocation) {
      setFormData({ ...formData, latitude: '', longitude: '' });
      setCustomLocation(true);
    } else {
      setCustomLocation(false);
      setFormData({
        ...formData,
        latitude: deserializedData.latitude,
        longitude: deserializedData.longitude,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    onSubmit(serializeData(formData))
      .catch((error) => {
        console.log('error in form is', error);
        setFormError(error);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4" ref={formRef}>
      <div className="flex flex-col gap-1 ">
        <FormGroup label="Name:">
          <Input
            name="name"
            className="w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </FormGroup>
        <FormGroup label="Station (device):" error={stationError}>
          <MyReactSelect
            formRef={formRef}
            tabIndex={0}
            className="w-full"
            name="station"
            value={getSelectedValues(formData.station, stationOptions)}
            options={stationOptions}
            onChange={(s) => setFormData({ ...formData, station: s })}
            isClearable={true}
            isSearchable={true}
            isLoading={stationStatus === 'pending'}
          />
        </FormGroup>
        <FormGroup label="Farm:" error={farmError}>
          <MyReactSelect
            formRef={formRef}
            tabIndex={0}
            className="w-full"
            name="farm"
            value={getSelectedValues(formData.farm, farmOptions)}
            options={farmOptions}
            onChange={(f) => setFormData({ ...formData, farm: f })}
            isLoading={farmStatus === 'pending'}
            isSearchable={false}
          />
        </FormGroup>
        <FormGroup label="Paw Graphs:" error={pawGraphError}>
          <MyReactSelect
            formRef={formRef}
            className="w-full"
            name="paw_graphs"
            value={getSelectedValues(formData.paw_graphs, pawGraphOptions)}
            onChange={(f) => setFormData({ ...formData, paw_graphs: f })}
            options={pawGraphOptions}
            isMulti={true}
            isClearable={true}
            isLoading={pawGraphStatus === 'pending'}
            isSearchable={false}
            closeMenuOnSelect={false}
          />
        </FormGroup>
        <FormGroup label="More Graphs:" error={allGraphError}>
          <MyReactSelect
            formRef={formRef}
            tabIndex={0}
            className="w-full"
            name="graphs"
            value={getSelectedValues(formData.graphs, allGraphOptions)}
            onChange={(f) => setFormData({ ...formData, graphs: f })}
            options={allGraphOptions}
            isMulti={true}
            isClearable={true}
            isLoading={allGraphStatus === 'pending'}
            closeMenuOnSelect={false}
          />
        </FormGroup>

        <FormGroup label="latitude:">
          <Input
            className="w-full"
            value={formData.latitude}
            onChange={(e) =>
              setFormData({ ...formData, latitude: e.target.value })
            }
            type="number"
            name="latitude"
            step="any"
            disabled={
              customLocation ? false : initialValues.latitude ? true : false
            }
          />
        </FormGroup>
        <FormGroup label="longitude:">
          <Input
            className="w-full"
            value={formData.longitude}
            onChange={(e) =>
              setFormData({ ...formData, longitude: e.target.value })
            }
            type="number"
            name="longitude"
            step="any"
            disabled={
              customLocation ? false : initialValues.longitude ? true : false
            }
          />
        </FormGroup>
        <FormGroup label="use different coordinates">
          <ToggleButton
            onToggle={handleCustomCoordsToggling}
            onTooltip="click to use marker's coordinates"
            offTooltip="click to use custom coordinates"
          />
        </FormGroup>
      </div>

      <FormErrorMessage error={formError} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <MyButton color="mute" onClick={onCancel}>
          Cancel
        </MyButton>
        <MyButton type="submit" disabled={submitting} color="primary">
          {submitting ? 'loading ...' : submitButtonText}
        </MyButton>
      </div>
    </form>
  );
}
