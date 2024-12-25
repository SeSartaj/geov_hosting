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

import { layerOptions } from '@/constants';
import useMapStore from '@/stores/mapStore';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { AccessTokenContext } from '@/contexts/AccessTokenProvider';
import { RadioGroup, RadioGroupItem } from '@/ui-components/RadioGroup';
import Label from '@/ui-components/Label';
import { Popover } from '@/ui-components/popover';
import { CalenderIcon } from '@/icons/calender';
import { maxWidth } from '@/constants/index';
import Card from '@/ui-components/Card';

export default function LayerPanel() {
  const { dateRange, setDateRange, setDatesLoading, isVisible, setIsVisible } =
    useContext(RasterLayerContext);
  const [selectedDate, setSelectedDate] = useState(dateRange?.start);
  const rasterOpacity = useMapStore((state) => state.rasterOpacity);
  const setRasterOpacity = useMapStore((state) => state.setRasterOpacity);
  const viewMode = useMapStore((state) => state.viewMode);
  const handleOpacityChange = (e) => {
    setRasterOpacity(e.target.value);
  };

  const rasterLayer = useMapStore((state) => state.rasterLayer);
  const setRasterLayer = useMapStore((state) => state.setRasterLayer);

  const { mapRef } = useContext(MapContext);
  const mapInstance = mapRef.current?.getMap();
  const [passDates, setPassDates] = useState([]);
  const accessToken = useContext(AccessTokenContext);

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
    if (!isVisible || mapInstance?.getZoom() < 9) {
      setPassDates([]);
    }
    const bounds = mapInstance?.getBounds();
    const bbox = [
      bounds?.getWest(),
      bounds?.getSouth(),
      bounds?.getEast(),
      bounds?.getNorth(),
    ];

    if (rasterLayer?.passDates) {
      console.log('Date not found in passDates');
      setDateRange({
        start: new Date(rasterLayer?.passDates[0]),
        end: new Date(rasterLayer?.passDates[0]),
      });
      const d = rasterLayer.passDates.map((d) => new Date(d));
      console.log('dddd', d);
      setPassDates(d);

      setDatesLoading(false);
    } else {
      const bounds = mapInstance.getBounds();
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];

      getSatellitePassDates({ aoi: bbox, accessToken })
        .then((dates) => {
          console.log('getting passDates', dates);
          setPassDates(dates);
          if (dates.length > 0) {
            console.log('setting date range', dates[0]);
            // set daterange start and end to the first most recent date in the dates
            setSelectedDate(dates[0]);
            setDateRange({
              start: dates[0],
              end: dates[0],
            });
          } else {
            // set date range to last 10 days
            setDateRange({
              start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              end: new Date(),
            });
          }
        })
        .finally(() => {
          setDatesLoading(false);
        });
    }
  }, [
    rasterLayer,
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
      mapInstance?.on('moveend', handlePassDates);
      mapInstance?.on('zoomend', handlePassDates);
    }

    return () => {
      if (mapInstance) {
        mapInstance?.off('moveend', handlePassDates);
        mapInstance?.off('zoomend', handlePassDates);
      }
    };
  }, [mapInstance, handlePassDates]);

  // at start run it once
  useEffect(() => {
    handlePassDates();
  }, []);

  // Re-render the Calendar whenever passDates changes
  useEffect(() => {
    console.log('passDates', passDates);
  }, [passDates]);

  const _onSelectSentinel = useCallback((e) => {
    console.log('_onSelectSentinel', e);
  }, []);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-2 rounded-md bg-zinc-50 p-2">
        <div className="flex items-center justify-between">
          <h4 className="scroll-m-20 text-lg font-medium tracking-tight">
            Sentinel
          </h4>
          <div className="flex items-center space-x-2">
            <RadioGroup
              defaultValue="all"
              className="flex items-center"
              onClick={_onSelectSentinel}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="plot" id="plot" />
                <Label htmlFor="plot">Plot</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="map" id="map" />
                <Label htmlFor="map">Map</Label>
              </div>
            </RadioGroup>
            <ToggleButton
              onTooltip="hide layer"
              offTooltip="show layer"
              initialState={isVisible}
              onToggle={setIsVisible}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center justify-between w-full">
            <h4 className="scroll-m-20 text-lg font-medium tracking-tight">
              Opacity
            </h4>
            {viewMode !== 'PICKER' && (
              <Popover
                trigger={
                  <div className="border border-solid border-gray-700 cursor-pointer dark:border-gray-200 rounded-md p-2 flex items-center justify-center">
                    <h5 className="scroll-m-20 text-sm font-medium tracking-tight">
                      {rasterOpacity}%
                    </h5>
                  </div>
                }
              >
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={rasterOpacity}
                  onChange={handleOpacityChange}
                  className="w-full"
                />
              </Popover>
            )}
          </div>
          <MyReactSelect
            size="sm"
            className="w-full"
            value={rasterLayer}
            options={layerOptions}
            placeholder="Select Data"
            onChange={(l) => setRasterLayer(l)}
            isClearable={false}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-md bg-zinc-50 p-2">
        <div className="flex items-center justify-between">
          <h4 className="scroll-m-20 text-lg font-medium tracking-tight">
            ETα
          </h4>
          <div className="flex items-center space-x-2">
            <RadioGroup defaultValue="all" className="flex items-center">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="plot" id="plot" />
                <Label htmlFor="plot">Plot</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="map" id="map" />
                <Label htmlFor="map">Map</Label>
              </div>
            </RadioGroup>
            <ToggleButton
              onTooltip="hide layer"
              offTooltip="show layer"
              initialState={isVisible}
              onToggle={setIsVisible}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <h4 className="scroll-m-20 text-lg font-medium tracking-tight">
            Opacity
          </h4>
          <Popover
            trigger={
              <div className="border border-solid border-gray-700 cursor-pointer dark:border-gray-200 rounded-md p-2 flex items-center justify-center">
                <h5 className="scroll-m-20 text-sm font-medium tracking-tight">
                  {rasterOpacity}%
                </h5>
              </div>
            }
          >
            <Input type="range" min="0" max="100" className="w-full" />
          </Popover>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2.5 mt-4">
        <h4 className="text-lg flex gap-3 font-semibold tracking-tight">
          <CalenderIcon /> Available Days
        </h4>
        <Card className="flex items-center justify-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              console.log('onDayClick', date);
              if (date) {
                // Convert the selected date to UTC by using Date.UTC and set it in state
                const utcDate = new Date(
                  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
                );
                setSelectedDate(utcDate);
                setDateRange({ start: utcDate, end: utcDate });
              }
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
              caption_label: 'rdp-caption_label z-0',
              root: maxWidth,
              table: maxWidth,
            }}
            footer={selectedDate ? `Selected: ${selectedDate}` : 'Pick a day.'}
          />
        </Card>
      </div>
    </div>
  );
}
