import { useState, useContext, useEffect, useCallback } from 'react';
import { MapContext } from '../../../contexts/MapContext';
import MyReactSelect from '@/ui-components/MyReactSelect';
import FormGroup from '@/ui-components/FormGroup';
import ToggleButton from '@/ui-components/toggleButton';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import Input from '@/ui-components/Input';
import { Calendar } from '@adobe/react-spectrum';
import { getSatellitePassDates } from '@/api/sentinalHubApi';
import { parseDate } from '@internationalized/date';
import useAccessToken from '@/hooks/useAccessToken';
import { layerOptions } from '@/constants';
import useMapStore from '@/stores/mapStore';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

export default function LayerPanel() {
  const { dateRange, setDateRange, setDatesLoading, isVisible, setIsVisible } =
    useContext(RasterLayerContext);
  const rasterOpacity = useMapStore((state) => state.rasterOpacity);
  const setRasterOpacity = useMapStore((state) => state.setRasterOpacity);
  const viewMode = useMapStore((state) => state.viewMode);
  const handleOpacityChange = (e) => {
    setRasterOpacity(e.target.value);
  };

  const rasterLayer = useMapStore((state) => state.rasterLayer);
  const setRasterLayer = useMapStore((state) => state.setRasterLayer);

  const { mapRef } = useContext(MapContext);
  const mapInstance = mapRef.current.getMap();
  const [passDates, setPassDates] = useState([]);
  const accessToken = useAccessToken();

  // Function to disable all days except those in the availableDays array
  const isDayDisabled = (date) => {
    return !passDates.some(
      (passDate) =>
        date.getFullYear() === passDate.getFullYear() &&
        date.getMonth() === passDate.getMonth() &&
        date.getDate() === passDate.getDate()
    );
  };

  // get bbox from viewport of map and call getSatellitePassDates
  //  and store all dates in a state
  // create a function handlePassDates
  const handlePassDates = useCallback(() => {
    setDatesLoading(true);
    if (!isVisible || mapInstance.getZoom() < 9) {
      setPassDates([]);
    }
    const bounds = mapInstance.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    getSatellitePassDates({ aoi: bbox, accessToken })
      .then((d) => {
        // const data = await response.json();
        const data = {
          features: [
            { properties: { datetime: '2024-09-05T00:00:00Z' } },
            { properties: { datetime: '2024-09-09T00:00:00Z' } },
            { properties: { datetime: '2024-09-22T00:00:00Z' } },
            { properties: { datetime: '2024-10-03T00:00:00Z' } },
            { properties: { datetime: '2024-11-01T00:00:00Z' } },
            { properties: { datetime: '2024-11-05T00:00:00Z' } },
          ],
        };
        // Extract dates from the response and sort in descending order
        const dates = data.features
          .map((feature) => new Date(feature.properties.datetime))
          .sort((a, b) => new Date(b) - new Date(a));

        console.log('getting passDates', dates);
        setPassDates(dates);
        if (dates.length > 0) {
          console.log('setting date range', dates[0]);
          // set daterange start and end to the first most recent date in the dates
          setDateRange({
            start: parseDate(dates[0].split('T')[0]),
            end: parseDate(dates[0].split('T')[0]),
          });
        }
      })
      .finally(() => {
        setDatesLoading(false);
      });
  }, [
    mapInstance,
    setPassDates,
    isVisible,
    setDateRange,
    setDatesLoading,
    accessToken,
  ]);

  // fetch pass dates for visible area from catalog api, sentinel hub
  useEffect(() => {
    if (mapInstance) {
      mapInstance.on('moveend', handlePassDates);
      mapInstance.on('zoomend', handlePassDates);
    }

    return () => {
      if (mapInstance) {
        mapInstance.off('moveend', handlePassDates);
        mapInstance.off('zoomend', handlePassDates);
      }
    };
  }, [mapInstance, handlePassDates]);

  // at start run it once
  useEffect(() => {
    handlePassDates();
  }, []);
  // Re-render the Calendar whenever passDates changes
  useEffect(() => {
    // This will trigger a re-render of the Calendar
    console.log('passDates', passDates);
  }, [passDates]);

  return (
    <div className="panel-container h-full overflow-y-scroll">
      <div className="panel-header-action mb-2">
        <h3 className="text-lg">Map Raster Layers</h3>
        {/* <AddNewLayerModal setLayers={setLayers} /> */}
        <span className="flex items-center">
          <ToggleButton
            onTooltip="hide layer"
            offTooltip="show layer"
            initialState={isVisible}
            onToggle={setIsVisible}
          />
        </span>
      </div>

      <div></div>
      <ul className="layers-list">
        <FormGroup label="layer:">
          <MyReactSelect
            size="sm"
            className="w-full"
            value={rasterLayer}
            options={layerOptions}
            onChange={(l) => setRasterLayer(l)}
            isClearable={false}
          />
        </FormGroup>
        {viewMode !== 'PICKER' && (
          <>
            {/* <hr /> */}
            <span>Opacity</span>
            <Input
              type="range"
              min="0"
              max="100"
              value={rasterOpacity}
              onChange={handleOpacityChange}
              className="w-full"
            />
          </>
        )}
        {/* <hr /> */}
        <span>Available Days:</span>
        {/* <DateRangePicker value={dateRange} onChange={setDateRange} /> */}

        <div className="p-4">
          <DayPicker
            mode="single"
            selected={dateRange.start}
            onSelect={(date) => {
              console.log('onDayClick', date);
              setDateRange({ start: date, end: date });
            }}
            modifiers={{
              disabled: isDayDisabled, // Pass the function here
              available: passDates,
            }}
            modifiersClassNames={{
              available:
                'dark:text-white bg-gray-200 dark:bg-gray-600 rounded-full ',
              selected: 'bg-green-400 dark:bg-green-600',
              today: 'dark:text-red',
            }}
          />
        </div>
      </ul>
    </div>
  );
}
