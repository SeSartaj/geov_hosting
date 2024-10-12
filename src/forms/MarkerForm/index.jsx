import { getFarmOptions } from "@/api/farmApi";
import { getAllGraphOptions, getPawGraphOptions } from "@/api/graphsApi";
import { getStationOptions } from "@/api/stationApi";
import useAsync from "@/hooks/useAsync";
import FormGroup from "@/ui-components/FormGroup";
import Input from "@/ui-components/Input";
import MyButton from "@/ui-components/MyButton";
import MyReactSelect from "@/ui-components/MyReactSelect";
import ToggleButton from "@/ui-components/toggleButton";
import { useState } from "react";



const emptyValues = {
    name: '',
    station: '',
    farm: '',
    paw_graphs: [],
    graphs: [],
    longitude: '',
    latitude: '',
  }

export default function MarkerForm({onSubmit, onCancel, initialValues, submitButtonText='Add Marker'}) {
    const {data: farmOptions, status: farmStatus, error: farmError, run: fetchFarmOptions} = useAsync(getFarmOptions, {data: []})
    const {data: stationOptions, status: stationStatus, error: stationError} = useAsync(getStationOptions, {data: []})
    const {data: pawGraphOptions, status: pawGraphStatus, error: pawGraphError} = useAsync(getPawGraphOptions, {data: []})
    const {data: allGraphOptions, status: allGraphStatus, error: allGraphError} = useAsync(getAllGraphOptions, {data: []})
    
    const [customLocation, setCustomLocation] = useState(false);
    // if user doesn't include all values in initialValues, emptyValues will be used
    const [formData, setFormData] = useState({...emptyValues, ...initialValues});



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
      onSubmit(formData);
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
              value={formData.station}
              options={stationOptions}
              onChange={(s) => setFormData({ ...formData, station: s })}
              isClearable={true}
              isLoading={stationStatus === "pending"}
            />
          </FormGroup>
          <FormGroup label='Farm:' error={farmError}>
            <MyReactSelect
              className='w-full'
              value={formData.farm}
              options={farmOptions}
              onChange={(f) => setFormData({ ...formData, farm: f })}
              isLoading={farmStatus === "pending"}
            />
          </FormGroup>
          <FormGroup label='Paw Graphs:' error={pawGraphError}>
            <MyReactSelect
              className='w-full'
              value={formData.paw_graphs}
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
              value={formData.graphs}
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
          <MyButton type='submit'>{submitButtonText}</MyButton>
        </div>
      </form>
    )
}