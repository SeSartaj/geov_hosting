import { useState, useContext, useEffect, useCallback } from 'react';
import { MapContext } from '../../../contexts/MapContext';
import MyReactSelect from '@/ui-components/MyReactSelect';
import FormGroup from '@/ui-components/FormGroup';
import ToggleButton from '@/ui-components/toggleButton';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import Input from '@/ui-components/Input';
import { Calendar } from '@adobe/react-spectrum';
import { getSatellitePassDates } from '@/api/sentinalHubApi';
import { PiCrosshair } from 'react-icons/pi';

export default function LayerPanel() {
  const {
    layer,
    layerOptions,
    setLayer,
    opacity,
    handleOpacityChange,
    dateRange,
    setDateRange,
    isVisible,
    setIsVisible,
    isDetailActive,
    handleStateChange,
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
    if (!isVisible || mapInstance.getZoom() < 9) setPassDates([]);
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
      // set daterange start and end to the first most recent date in the dates
      setDateRange({ start: dates[0], end: dates[0] });
    });
  }, [mapInstance, setPassDates, isVisible, setDateRange]);

  useEffect(() => {
    mapInstance.on('moveend', handlePassDates);
    mapInstance.on('zoomend', handlePassDates);

    return () => {
      mapInstance.off('moveend', handlePassDates);
      mapInstance.off('zoomend', handlePassDates);
    };
  }, [mapInstance, handlePassDates]);

  // Re-render the Calendar whenever passDates changes
  useEffect(() => {
    // This will trigger a re-render of the Calendar
  }, [passDates]);

  return (
    <div className='panel-container h-full overflow-y-scroll'>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Map Raster Layers</h3>
        {/* <AddNewLayerModal setLayers={setLayers} /> */}
        <span className='flex items-center'>
          <PiCrosshair
            size={24}
            style={isDetailActive ? { color: 'blue' } : { color: 'gray' }}
            onClick={() => handleStateChange(!isDetailActive)}
          />
          <ToggleButton
            onTooltip='hide layer'
            offTooltip='show layer'
            initialState={isVisible}
            onToggle={setIsVisible}
          />
        </span>
      </div>
      <hr />

      <div></div>
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
        {/* <span>Calender:</span> */}
        {/* <DateRangePicker value={dateRange} onChange={setDateRange} /> */}
        <div className='p-4'>
          <Calendar
            isDateUnavailable={isDateUnavailable}
            value={dateRange.start}
            onChange={(date) => {
              console.log('onFocusChange date', date);
              setDateRange({ start: date, end: date });
            }}
            dayStyle={(date) => {
              const isUnavailable = isDateUnavailable(date);
              return {
                backgroundColor: isUnavailable ? 'red' : 'transparent',
                color: isUnavailable ? 'white' : 'inherit',
              };
            }}
          />
        </div>
      </ul>
    </div>
  );
}
