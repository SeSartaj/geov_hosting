import { useState, useContext, useEffect, useCallback } from 'react';
import { MapContext } from '../../../contexts/MapContext';
import { BiTrash } from 'react-icons/bi';
import AddNewLayerModal from '../../AddNewLayer';
import AddNewSourceModal from '../../AddNewSourceModal';
import Layer from '../../Layer';
import MyReactSelect from '@/ui-components/MyReactSelect';
import FormGroup from '@/ui-components/FormGroup';
import ToggleButton from '@/ui-components/toggleButton';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import Input from '@/ui-components/Input';
import { Calendar, DateRangePicker } from '@adobe/react-spectrum';
import { getSatellitePassDates } from '@/api/sentinalHubApi';
import convertBoundsToBboxString from '@/utils/convertBoundsToBboxString';

export default function LayerPanel() {
  const {
    layer,
    layerOptions,
    setLayer,
    opacity,
    handleOpacityChange,
    dateRange,
    setDateRange,
  } = useContext(RasterLayerContext);
  const { mapInstance } = useContext(MapContext);
  const [passDates, setPassDates] = useState([]);

  console.log('dateRange is', dateRange);

  function isDateUnavailable(date) {
    // Convert the input date to a string in the format YYYY-MM-DD
    const inputDateString = new Date(date).toISOString().split('T')[0];

    // Convert each date in the array to the format YYYY-MM-DD and check for a match
    return !passDates.some((dateString) => {
      const formattedDate = new Date(dateString).toISOString().split('T')[0];
      return formattedDate === inputDateString;
    });
  }

  // get bbox from viewport of map and call getSatellitePassDates
  //  and store all dates in a state
  // create a function handlePassDates
  const handlePassDates = useCallback(() => {
    const bounds = mapInstance.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];
    getSatellitePassDates(bbox).then((dates) => {
      console.log('dates', dates);
      setPassDates(dates);
    });
  }, [mapInstance, setPassDates]);

  useEffect(() => {
    handlePassDates();
  }, [mapInstance, handlePassDates]);

  return (
    <div className='panel-container h-full overflow-y-scroll'>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Map Raster Layers</h3>
        {/* <AddNewLayerModal setLayers={setLayers} /> */}
        <ToggleButton onTooltip='hide layer' offTooltip='show layer' />
      </div>
      <hr />
      <ul className='layers-list'>
        <FormGroup label='layer:'>
          <MyReactSelect
            size='sm'
            className='w-full'
            value={layer}
            options={layerOptions}
            onChange={(l) => setLayer(l)}
            isClearable={false}
          />
        </FormGroup>
        <hr />
        <span>Opacity</span>
        <Input
          type='range'
          min='0'
          max='100'
          value={opacity}
          onChange={handleOpacityChange}
          className='w-full'
        />
        <hr />
        <span>Calender:</span>
        {/* <DateRangePicker value={dateRange} onChange={setDateRange} /> */}
        <Calendar isDateUnavailable={isDateUnavailable} />
      </ul>
    </div>
  );
}
