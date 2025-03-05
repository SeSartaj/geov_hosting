import {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
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
import Spinner from '@/ui-components/Spinner';
import { useIntl } from 'react-intl';

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
  if (westSouthDistance > 1 || eastNorthDistance > 1) return true;

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
  const { dateRange, setDateRange, isVisible, setIsVisible } =
    useContext(RasterLayerContext);
  const datesLoading = useMapStore((s) => s.datesLoading);
  const setDatesLoading = useMapStore((s) => s.setDatesLoading);
  const [selectedDate, setSelectedDate] = useState();
  const intl = useIntl();

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
  const [previousBbox, setPreviousBbox] = useState([]);
  const showCroppedImages = useMapStore((s) => s.showCroppedImages);
  const setShowCroppedImages = useMapStore((s) => s.setShowCroppedImages);
  const abortControllerRef = useRef(null);

  // Function to disable all days except those in the availableDays array
  const isDayDisabled = (date) => {
    return !passDates.some(
      (passDate) =>
        date.getFullYear() === passDate.getFullYear() &&
        date.getMonth() === passDate.getMonth() &&
        date.getDate() === passDate.getDate()
    );
  };

  const handleSelectedDateChange = (date) => {
    console.log('ddd running handleSelectedDateChange', date);
    // if date is undefined,
    if (date === undefined) {
      setSelectedDate(undefined);
      setDateRange({ start: undefined, end: undefined });
    } else {
      const start = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 1)
      );
      const end = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59
        )
      );

      setSelectedDate(date);
      setDateRange({ start: start, end: end });
    }
  };

  const handleLayerDatesChange = (dates) => {
    if (dates.length > 0) {
      let isCurrentDateExist = false;
      // if selectedDates is present in the new dates list, keep it uncahnged
      if (selectedDate) {
        isCurrentDateExist = dates
          .map((d) => d.getTime())
          .includes(selectedDate.getTime());
      }

      if (isCurrentDateExist) {
        // do nothing
        console.log(
          'ddd currently selected date is included in new available dates, itll stay the same'
        );
      } else {
        // first sort the dates in reverse cronological ordeer
        dates.sort((a, b) => b - a);

        // set the most recent date
        console.log('ddd most recent date', dates[0]);
        handleSelectedDateChange(dates[0]);
      }
    } else {
      console.log('ddd no available date fetched');
      // set date range to last 10 days
      if (!selectedDate) {
        handleSelectedDateChange(undefined);
      }
    }
  };

  // get bbox from viewport of map and call getSatellitePassDates
  //  and store all dates in a state
  // create a function handlePassDates

  const handlePassDates = useCallback(
    (options) => {
      console.log('inside handlePassDates. options', options);
      if (!mapInstance) {
        console.log('no map instance found to load available dates');
        return;
      }

      setDatesLoading(true);

      if (mapInstance?.getZoom() < 9) {
        console.log('layer is not visible or zoom is smaller than 9');
        setPassDates([]);
        setDatesLoading(false);
        return;
      }

      const bounds = mapInstance?.getBounds();
      let bbox = bounds
        ? [
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth(),
        ]
        : undefined;

      if (!bbox) {
        console.warn('no bounds found. not fetching available dates');
        setDatesLoading(false);
        return;
      }

      // if layer and bbox  is not changed, don't fetch dates
      if (!options?.layerChanged && previousBbox?.length > 0) {
        if (!hasBboxChanged(previousBbox, bbox)) {
          setPreviousBbox(bbox);
          console.log('bbox has not changed significantly');
          setDatesLoading(false);
          return;
        }
      }

      setPreviousBbox(bbox);

      // Cancel the previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create a new abort controller for the new request
      const controller = new AbortController();
      const { signal } = controller;
      abortControllerRef.current = controller;

      const fetchDates = rasterLayer?.getAvailableDates
        ? rasterLayer.getAvailableDates(bbox)
        : getSatellitePassDates({ aoi: bbox, accessToken });

      fetchDates
        .then((dates) => {
          if (signal.aborted) {
            console.log('Request was aborted, ignoring response');
            return;
          }

          setPassDates(dates);
          handleLayerDatesChange(dates);
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.log('Previous request aborted');
          } else {
            console.error('Error fetching dates:', error);
          }
        })
        .finally(() => {
          if (!signal.aborted) {
            setDatesLoading(false);
          }
        });
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
    () => debounce(handlePassDates, 1000),
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
    handlePassDates({ layerChanged: true });
  }, [mapInstance, rasterLayer, accessToken]);

  const _onSelectSentinel = useCallback(
    (value) => {
      if (value === 'plot') {
        setShowCroppedImages(true);
      }
      if (value === 'map') {
        setShowCroppedImages(false);
      }
    },
    [setShowCroppedImages]
  );

  const setCroppedRasterLayersOpacity = useCallback(
    (op) => {
      if (!mapInstance) return;

      mapInstance.getStyle().layers.forEach((layer) => {
        if (layer.id.startsWith('croppedImageLayer-')) {
          mapInstance.setPaintProperty(
            layer.id,
            'raster-opacity',
            Number(op / 100)
          );
        }
      });
    },
    [mapInstance]
  );

  const debouncedSetCroppedRasterLayersOpacity = debounce(
    setCroppedRasterLayersOpacity,
    500
  );

  const handleRasterOpacityChange = useCallback((e) => {
    const op = e.target.value;
    setRasterOpacity(op);
    debouncedSetCroppedRasterLayersOpacity(op);
    // Store the opacity in state
  });

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-2 rounded-md bg-zinc-50 dark:bg-zinc-800 p-2">
        <div className="flex items-center justify-between">
          <h4 className="text-base dark:text-gray-100 tracking-tight">
            {intl.formatMessage({ id: 'app.agviewer_map.raster_layer', defaultMessage: 'Raster Layer' })}

          </h4>
          <div className="flex items-center space-x-2">
            <RadioGroup
              defaultValue={showCroppedImages ? 'plot' : 'map'}
              className="flex items-center"
              onValueChange={_onSelectSentinel}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="plot" id="plot" />
                <Label htmlFor="plot">{intl.formatMessage({ id: 'app.agviewer_map.plot', defaultMessage: 'Plot' })}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="map" id="map" />
                <Label htmlFor="map">{intl.formatMessage({ id: 'app.agviewer_map.map', defaultMessage: 'Map' })}</Label>
              </div>
            </RadioGroup>
            <ToggleButton
              onTooltip={intl.formatMessage({ id: 'app.agviewer_map.hide_layer', defaultMessage: "Hide Layer" })}
              offTooltip={intl.formatMessage({ id: 'app.agviewer_map.show_layer', defaultMessage: "Show Layer" })}
              value={isVisible}
              onChange={setIsVisible}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center justify-between w-full">
            <h4 className="text-base dark:text-gray-100 tracking-tight">
              {intl.formatMessage({ id: 'app.agviewer_map.opacity', defaultMessage: "Opacity" })}
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
                  onChange={handleRasterOpacityChange}
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
            onChange={setRasterLayer}
            isClearable={false}
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-2.5 mt-4">
        <h4 className="text-base flex gap-3 font-medium tracking-tight">
          <CalenderIcon /> {intl.formatMessage({ id: 'app.agviewer_map.available_days', defaultMessage: "Available Days" })}{' '}
          {datesLoading && <Spinner size="small" />}
        </h4>
        <Card className="flex items-center justify-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            classNames={{
              months: 'rdp-months justify-center',
            }}
            onSelect={handleSelectedDateChange}
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
