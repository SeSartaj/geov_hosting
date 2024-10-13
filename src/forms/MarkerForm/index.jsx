import { getFarmOptions } from "@/api/farmApi";
import { getAllGraphOptions, getPawGraphOptions } from "@/api/graphsApi";
import { getStationOptions } from "@/api/stationApi";
import { SettingsContext } from "@/contexts/SettingsContext";
import useAsync from "@/hooks/useAsync";
import FormGroup from "@/ui-components/FormGroup";
import Input from "@/ui-components/Input";
import MyButton from "@/ui-components/MyButton";
import MyReactSelect from "@/ui-components/MyReactSelect";
import Spinner from "@/ui-components/Spinner";
import ToggleButton from "@/ui-components/toggleButton";
import getSelectedValues from "@/utils/getSelectedValues";
import { useContext, useState } from "react";




const emptyValues = {
    name: '',
    station: '',
    farm: '',
    paw_graphs: [],
    graphs: [],
    longitude: '',
    latitude: '',
  }



export default function MarkerForm({onSubmit,  onCancel, initialValues = {}, marker, submitButtonText='Add Marker'}) {
  
  
  const {data: farmOptions, status: farmStatus, error: farmError, run: fetchFarmOptions} = useAsync(getFarmOptions, {data: []})
    const {data: stationOptions, status: stationStatus, error: stationError} = useAsync(getStationOptions, {data: []})
    const {data: pawGraphOptions, status: pawGraphStatus, error: pawGraphError} = useAsync(getPawGraphOptions, {data: []})
    const {data: allGraphOptions, status: allGraphStatus, error: allGraphError} = useAsync(getAllGraphOptions, {data: []})
    
  const { settings } = useContext(SettingsContext);
  const [submitting, setSubmitting] = useState(false);

    const [customLocation, setCustomLocation] = useState(false);


    const serializeData = (formData) => {
      const data =   {
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

      if (formData?.id) data.id = formData.id;

      return data
    }

    const deserializeData = (data) => {
      return {
        id: data.id,
        name: data.location_name, 
        longitude: data.lng,
        latitude: data.lat,
        farm: data.farm,
        station: data.device,
        paw_graphs: data.paw_graphs, 
        graphs: data.graphs,
      }
    }

    const deserializedData = marker ? deserializeData(marker) : {};
    // if user doesn't include all values in initialValues, emptyValues will be used
    const [formData, setFormData] = useState({...emptyValues, ...deserializedData, ...initialValues});



    const handleCustomCoordsToggling = (isCustomLocation) => {
        if(isCustomLocation){
          setFormData({...formData, latitude: '', longitude: ''});
          setCustomLocation(true);
        } 
        else {
          setCustomLocation(false);
          setFormData({...formData, latitude: initialValues.latitude, longitude: initialValues.longitude});
        }
      }



    const handleSubmit = (e) => {
      e.preventDefault();
      setSubmitting(true);
      onSubmit(serializeData(formData)).finally(() => setSubmitting(false));
    }


    return (
        <form onSubmit={handleSubmit} className='p-4'>
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
          <FormGroup label='Station (device):' error={stationError}>
            <MyReactSelect
              className='w-full'
              value={getSelectedValues(formData.station, stationOptions)}
              options={stationOptions}
              onChange={(s) => setFormData({ ...formData, station: s })}
              isClearable={true}
              isLoading={stationStatus === "pending"}
            />
          </FormGroup>
          <FormGroup label='Farm:' error={farmError}>
            <MyReactSelect
              className='w-full'
              value={getSelectedValues(formData.farm, farmOptions)}
              options={farmOptions}
              onChange={(f) => setFormData({ ...formData, farm: f })}
              isLoading={farmStatus === "pending"}
            />
          </FormGroup>
          <FormGroup label='Paw Graphs:' error={pawGraphError}>
            <MyReactSelect
              className='w-full'
              value={getSelectedValues(formData.paw_graphs, pawGraphOptions)}
              onChange={(f) => setFormData({ ...formData, paw_graphs: f })}
              options={pawGraphOptions}
              isMulti={true}
              isClearable={true}
              isLoading={pawGraphStatus === "pending"}
            />
          </FormGroup>
          <FormGroup label='More Graphs:' error={allGraphError}>
            <MyReactSelect
              className='w-full'
              value={getSelectedValues(formData.graphs, allGraphOptions)}
              onChange={(f) => setFormData({ ...formData, graphs: f })}
              options={allGraphOptions}
              isMulti={true}
              isClearable={true}
              isLoading={allGraphStatus === "pending"}
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
              disabled={customLocation ? false :  initialValues.latitude ? true : false}
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
              disabled={customLocation ? false :  initialValues.longitude ? true : false}
            />
          </FormGroup>
          <FormGroup label="use different coordinates">
            <ToggleButton onToggle={handleCustomCoordsToggling} onTooltip="click to use marker's coordinates" offTooltip="click to use custom coordinates"/>
          </FormGroup>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <MyButton variant='text' onClick={onCancel}>
            cancel
          </MyButton>
          <MyButton type='submit' disabled={submitting}>{submitting ? "loading ..." :  submitButtonText}</MyButton>
        </div>
      </form>
    )
}