import './styles.css';
import MyModal from '../../ui-components/MyModal';
import MyButton from '../../ui-components/MyButton';
import { useContext, useEffect, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { MarkersContext } from '../../contexts/markersContext';
import Select from 'react-select';
import { BiPin } from 'react-icons/bi';
import Input from '@/ui-components/Input';
import InlineInputField from '@/ui-components/InlineInputField';
import MyReactSelect from '@/ui-components/MyReactSelect';
import InputField from '@/ui-components/InputField';
import FormGroup from '@/ui-components/FormGroup';
import { getFarmOptions } from '@/api/farmApi';
import { getStationOptions } from '@/api/stationApi';
import { getAllGraphOptions, getPawGraphOptions } from '@/api/graphsApi';

const AddNewMarkerModal = ({ feature }) => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const [farmOptions, setFarmOptions] = useState([]);
  const [stationOptions, setStationOptions] = useState([]);
  const [pawGraphOptions, setPawGraphOptions] = useState([]);
  const [allGraphOptions, setAllGraphOptions] = useState([]);
  const { markers, addNewMarker } = useContext(MarkersContext);
  const [formData, setFormData] = useState({
    station: '',
    farm: '',
    paw_graphs: [],
    graphs: [],
  });

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
      farm: formData.farm,
      device: formData.station,

      longitude: feature?.geometry?.coordinates[0],
      latitude: feature?.geometry?.coordinates[1],
    };

    console.log('newMarker', newMarker);
    addNewMarker(newMarker);

    setOpen(false);
  };

  useEffect(() => {
    getFarmOptions().then((options) => {
      setFarmOptions(options);
    });
    getStationOptions().then((options) => {
      setStationOptions(options);
    });
    getPawGraphOptions().then((options) => {
      setPawGraphOptions(options);
    });
    getAllGraphOptions().then((options) => {
      setAllGraphOptions(options);
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
          <FormGroup label='Station:'>
            <MyReactSelect
              className='w-full'
              value={formData.station}
              options={stationOptions}
              onChange={(s) => setFormData({ ...formData, station: s })}
              isClearable={true}
            />
          </FormGroup>
          <FormGroup label='Farm:'>
            <MyReactSelect
              className='w-full'
              value={formData.farm}
              options={farmOptions}
              onChange={(f) => setFormData({ ...formData, farm: f })}
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
            />
          </FormGroup>
          <FormGroup label='latitude:'>
            <Input
              className='w-full'
              value={feature?.geometry?.coordinates[1].toFixed(7)}
              type='number'
              name='latitude'
              step='any'
              disabled={feature ? true : false}
            />
          </FormGroup>
          <FormGroup label='longitude:'>
            <Input
              className='w-full'
              value={feature?.geometry?.coordinates[0].toFixed(7)}
              type='number'
              name='longitude'
              step='any'
              disabled={feature ? true : false}
            />
          </FormGroup>
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
