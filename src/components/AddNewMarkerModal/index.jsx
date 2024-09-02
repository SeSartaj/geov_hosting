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

const AddNewMarkerModal = ({ feature, deleteFeature }) => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const [farmOptions, setFarmOptions] = useState([]);
  const [stationOptions, setStationOptions] = useState([]);
  const [pawGraphOptions, setPawGraphOptions] = useState([]);
  const [allGraphOptions, setAllGraphOptions] = useState([]);
  const { addNewMarker } = useContext(MarkersContext);
  const { settings } = useContext(SettingsContext);
  const [formData, setFormData] = useState({
    name: '',
    station: '',
    farm: '',
    paw_graphs: [],
    graphs: [],
    longitude: feature?.geometry?.coordinates[0],
    latitude: feature?.geometry?.coordinates[1],
  });

  const [loadings, setLoadings] = useState({
    farm: false,
    station: false,
    pawGraphs: false,
    graphs: false,
  });

  const handleClose = () => {
    deleteFeature();
    setOpen(false);
  };

  const handleNewMarkerCreation = (e) => {
    e.preventDefault();

    console.log('formData', formData);
    const newMarker = {
      marker_map: settings.mapId,
      device: formData.station.value,
      paw_graphs: formData.paw_graphs.map((g) => g.value),
      graphs: formData.graphs.map((g) => g.value),
      lng: formData.longitude,
      lat: formData.latitude,
      location_name: formData.name,
      farm: formData.farm.value,
      use_custom_location: true,
    };
    addNewMarker(newMarker);
    deleteFeature();
    handleClose();
  };

  useEffect(() => {
    setLoadings({
      farm: true,
      station: true,
      pawGraphs: true,
      graphs: true,
    });
    getFarmOptions()
      .then((options) => {
        setFarmOptions(options);
      })
      .finally(() => {
        setLoadings({
          ...loadings,
          farm: false,
        });
      });
    getStationOptions()
      .then((options) => {
        setStationOptions(options);
      })
      .finally(() => {
        setLoadings({
          ...loadings,
          station: false,
        });
      });
    getPawGraphOptions()
      .then((options) => {
        setPawGraphOptions(options);
      })
      .finally(() => {
        setLoadings({
          ...loadings,
          pawGraphs: false,
        });
      });
    getAllGraphOptions()
      .then((options) => {
        setAllGraphOptions(options);
      })
      .finally(() => {
        setLoadings({
          ...loadings,
          graphs: false,
        });
      });
  }, []);

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
        <div className='flex flex-col gap-1 '>
          <FormGroup label='Name:'>
            <Input
              name='name'
              className='w-full'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup label='Station (device):'>
            <MyReactSelect
              className='w-full'
              value={formData.station}
              options={stationOptions}
              onChange={(s) => setFormData({ ...formData, station: s })}
              isClearable={true}
              isLoading={loadings.station}
            />
          </FormGroup>
          <FormGroup label='Farm:'>
            <MyReactSelect
              className='w-full'
              value={formData.farm}
              options={farmOptions}
              onChange={(f) => setFormData({ ...formData, farm: f })}
              isLoading={loadings.farm}
            />
          </FormGroup>
          <FormGroup label='Paw Graphs:'>
            <MyReactSelect
              className='w-full'
              value={formData.paw_graphs}
              onChange={(f) => setFormData({ ...formData, paw_graphs: f })}
              options={pawGraphOptions}
              isMulti={true}
              isClearable={true}
              isLoading={loadings.pawGraphs}
            />
          </FormGroup>
          <FormGroup label='More Graphs:'>
            <MyReactSelect
              className='w-full'
              value={formData.graphs}
              onChange={(f) => setFormData({ ...formData, graphs: f })}
              options={allGraphOptions}
              isMulti={true}
              isClearable={true}
              isLoading={loadings.graphs}
            />
          </FormGroup>
          <FormGroup label='latitude:'>
            <Input
              className='w-full'
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: e.target.value })
              }
              type='number'
              name='latitude'
              step='any'
              disabled={feature ? true : false}
            />
          </FormGroup>
          <FormGroup label='longitude:'>
            <Input
              className='w-full'
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: e.target.value })
              }
              type='number'
              name='longitude'
              step='any'
              disabled={feature ? true : false}
            />
          </FormGroup>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <MyButton variant='text' onClick={handleClose}>
            cancel
          </MyButton>
          <MyButton type='submit'>Add Marker</MyButton>
        </div>
      </form>
    </MyModal>
  );
};

export default AddNewMarkerModal;
