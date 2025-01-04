import { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { MapContext } from '../../../contexts/MapContext';
import MyReactSelect from '@/ui-components/MyReactSelect';
import ToggleButton from '@/ui-components/toggleButton';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import Input from '@/ui-components/Input';
import { getSatellitePassDates } from '@/api/sentinalHubApi';

import { layerOptions } from '@/constants';
import useMapStore from '@/stores/mapStore';
import { DayPicker, Month, MonthGrid, Months } from 'react-day-picker';
import 'react-day-picker/style.css';
import { AccessTokenContext } from '@/contexts/AccessTokenProvider';
import { RadioGroup, RadioGroupItem } from '@/ui-components/RadioGroup';
import Label from '@/ui-components/Label';
import { Popover } from '@/ui-components/popover';
import { CalenderIcon } from '@/icons/calender';
import { maxWidth } from '@/constants/index';
import Card from '@/ui-components/Card';
import { PlotContext } from '@/contexts/PlotContext';
import debounce from '@/utils/debounce';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as turf from '@turf/turf';

function hasBboxChanged(previousBbox, currentBbox) {
  if (!previousBbox || !currentBbox) return true;
  console.log('previousBbox', previousBbox);
  console.log('currentBbox', currentBbox);

  // Extract corners
  const [prevWest, prevSouth, prevEast, prevNorth] = previousBbox;
  const [currWest, currSouth, currEast, currNorth] = currentBbox;

  // Calculate distances between corresponding corners
  const westSouthDistance = turf.distance(
    [prevWest, prevSouth],
    [currWest, currSouth],
    { units: 'kilometers' }
  );
  const eastNorthDistance = turf.distance(
    [prevEast, prevNorth],
    [currEast, currNorth],
    { units: 'kilometers' }
  );

  // Return true if any corner moves more than 1 km
  if (westSouthDistance > 2 || eastNorthDistance > 2) return true;

  // Otherwise, return false
  return false;
}

const CalenderNavComponent = ({
  previousMonth,
  nextMonth,
  onPreviousClick,
  onNextClick,
}) => {
  // get current month from previous month
  const currentMonth = new Date(
    previousMonth.getFullYear(),
    previousMonth.getMonth() + 1,
    1
  );
  return (
    <div className="flex items-center justify-between w-full px-5">
      {/* Left Arrow */}
      <Button onClick={onPreviousClick} variant="ghost">
        <ChevronLeft />
      </Button>
      {/* Month and Year */}
      <span className="text-lg font-medium text-center mx-4">
        {currentMonth.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })}
      </span>
      {/* Right Arrow */}
      <Button onClick={onNextClick} variant="ghost">
        <ChevronRight />
      </Button>
    </div>
  );
};

export default function LayerPanel() {
  const { dateRange, setDateRange, setDatesLoading, isVisible, setIsVisible } =
    useContext(RasterLayerContext);
  const [selectedDate, setSelectedDate] = useState();

  const { showNdviLayer, toggleNDVILayersVisibility } = useContext(PlotContext);
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
  const [previousBbox, setPreviousBbox] = useState();

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
  const handlePassDates = useCallback(
    (e) => {
      if (!mapInstance) return;

      setDatesLoading(true);
      // too much zoom out? don't bother fetching available dates
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

      setPreviousBbox(bbox);

      // if the map moved/zoomed in/zoomed out by a very small amount, don't refetch the dates
      if (!hasBboxChanged(previousBbox, bbox)) {
        console.log('bbox has not changed significantly');
        setDatesLoading(false);
        return;
      } else {
        console.log('bbox has changed significantly');
      }

      console.log('selectedDate', selectedDate);

      if (rasterLayer?.passDates) {
        let isCurrentDateExist;
        // change the selectedDate to yyyy-mm-dd format
        if (selectedDate) {
          isCurrentDateExist = rasterLayer?.passDates
            .map((d) => new Date(d).getTime())
            .includes(selectedDate.getTime());
        }

        console.log(
          'selectedDate current exist',
          isCurrentDateExist,
          selectedDate,
          selectedDate?.toISOString()?.split('T')[0],
          rasterLayer?.passDates
        );

        if (!selectedDate || !isCurrentDateExist) {
          console.log('raster layer have no current date exist');
          // it is assumed that passDates are sorted in chronological order
          setDateRange({
            start: new Date(
              rasterLayer?.passDates[rasterLayer.passDates.length - 1]
            ),
            end: new Date(
              rasterLayer?.passDates[rasterLayer.passDates.length - 1]
            ),
          });
          setSelectedDate(
            new Date(rasterLayer?.passDates[rasterLayer.passDates.length - 1])
          );
        }

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
              // if selected date was not in list of dates, set it to the first date
              // otherwise lave the date untouched

              if (
                selectedDate &&
                !dates.map((d) => d.getTime()).includes(selectedDate.getTime())
              ) {
                console.log(
                  'dates doesnt include selected date. choosing most recent date'
                );
                setSelectedDate(dates[0]);
                setDateRange({
                  start: dates[0],
                  end: dates[0],
                });
              } else {
                console.log(
                  'currently selected date is included in new available dates, itll stay the same'
                );
              }
            } else {
              console.log('no available date fetched');
              // set date range to last 10 days
              if (!selectedDate) {
                setDateRange({
                  start: undefined,
                  end: undefined,
                });
              }
            }
          })
          .finally(() => {
            setDatesLoading(false);
          });
      }
    },
    [
      selectedDate,
      rasterLayer,
      mapInstance,
      setPassDates,
      isVisible,
      setDateRange,
      setDatesLoading,
      accessToken,
    ]
  );

  const debouncedHandlePassDates = useMemo(
    () => debounce(handlePassDates, 2000),
    [handlePassDates]
  );

  // fetch pass dates for visible area from catalog api, sentinel hub
  useEffect(() => {
    if (mapInstance) {
      mapInstance?.on('moveend', debouncedHandlePassDates);
      mapInstance?.on('zoomend', debouncedHandlePassDates);
    }

    return () => {
      if (mapInstance) {
        mapInstance?.off('moveend', debouncedHandlePassDates);
        mapInstance?.off('zoomend', debouncedHandlePassDates);
      }
      debouncedHandlePassDates.cancel();
    };
  }, [mapInstance, debouncedHandlePassDates]);

  useEffect(() => {
    handlePassDates();
  }, [mapInstance, rasterLayer]);

  const _onSelectSentinel = useCallback(
    (value) => {
      if (value === 'plot') {
        toggleNDVILayersVisibility(true);
      }
      if (value === 'map') {
        toggleNDVILayersVisibility(false);
      }
    },
    [toggleNDVILayersVisibility]
  );

  useEffect(() => {
    console.log('changed!!!", selectedDate', selectedDate);
    console.log('changed!!!", passDates', passDates);
  }, [selectedDate, passDates]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-2 rounded-md bg-zinc-50 dark:bg-zinc-800 p-2">
        <div className="flex items-center justify-between">
          <h4 className="text-base dark:text-gray-100 tracking-tight">
            Raster Layer
          </h4>
          <div className="flex items-center space-x-2">
            <RadioGroup
              defaultValue={showNdviLayer ? 'plot' : 'map'}
              className="flex items-center"
              onValueChange={_onSelectSentinel}
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
            <h4 className="text-base dark:text-gray-100 tracking-tight">
              Opacity
            </h4>
            {viewMode !== 'PICKER' && (
              <Popover
                trigger={
                  <div className="border border-solid border-[#D1D5DB] cursor-pointer dark:border-gray-200 rounded-md p-2 flex items-center justify-center">
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
      <div className="w-full flex flex-col gap-2.5 mt-4">
        <h4 className="text-base flex gap-3 font-medium tracking-tight">
          <CalenderIcon /> Available Days
        </h4>
        <Card className="flex items-center justify-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            classNames={{
              months: 'rdp-months justify-center',
            }}
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
              // root: maxWidth,
              // table: maxWidth,
            }}
            components={{
              Nav: CalenderNavComponent,
              MonthCaption: () => <span></span>,
            }}
          />
        </Card>
      </div>
    </div>
  );
}
