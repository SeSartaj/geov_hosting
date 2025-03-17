import 'react-day-picker/style.css';
import './styles.css';

import * as turf from '@turf/turf';

import { getSatellitePassDates } from '@/api/sentinalHubApi';
import { Card as ShadcnCardn, CardContent } from '@/components/ui/card';

import useMapStore from '@/stores/mapStore';
import { useIntl } from 'react-intl';
import { DayPicker, Month, MonthGrid, Months, TZDate } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CalenderIcon } from '@/icons/calender';
import Card from '@/ui-components/Card';

import Spinner from '@/ui-components/Spinner';
import { AccessTokenContext } from '@/contexts/AccessTokenProvider';
import { MapContext } from '@/contexts/MapContext';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import debounce from '@/utils/debounce';

// Function to disable all days except those in the availableDays array
const isDayDisabled = (passDates) => {
  return (date) => {
    return !passDates.some(
      (passDate) =>
        date.getFullYear() === passDate.getFullYear() &&
        date.getMonth() === passDate.getMonth() &&
        date.getDate() === passDate.getDate()
    );
  };
};

function hasBboxChanged(previousBbox, currentBbox) {
  console.log('ddd checking bbox');
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

export default function AvailableDatesCalender({
  setDateRange,
  compact = false,
  mapRef,
}) {
  console.log('ddd inside available dates');
  const intl = useIntl();

  const { isVisible, setIsVisible } = useContext(RasterLayerContext);

  const rasterLayer = useMapStore((state) => state.rasterLayer);
  const setRasterLayer = useMapStore((state) => state.setRasterLayer);

  const setDatesLoading = useMapStore((s) => s.setDatesLoading);
  const datesLoading = useMapStore((s) => s.datesLoading);

  const { mapRef: mapRefContext } = useContext(MapContext);

  const mapInstance = mapRef?.current?.getMap();

  const accessToken = useContext(AccessTokenContext);
  const [previousBbox, setPreviousBbox] = useState([]);
  const abortControllerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState();

  const passDates = useMapStore((s) => s.passDates);
  const setPassDates = useMapStore((s) => s.setPassDates);

  const timeZonePassDates = useMemo(() => {
    return passDates.map((date) => new TZDate(date, 'UTC'));
  }, [passDates]);

  const handleLayerDatesChange = (dates) => {
    console.log('handleLayerDatesChange', selectedDate, dates);
    if (dates.length > 0) {
      let isCurrentDateExist = false;
      // if selectedDates is present in the new dates list, keep it uncahnged
      if (selectedDate) {
        console.log('ddd selectedDate exist', selectedDate, dates);
        isCurrentDateExist = dates.some(
          (d) =>
            d.getFullYear() === selectedDate.getFullYear() &&
            d.getMonth() === selectedDate.getMonth() &&
            d.getDate() === selectedDate.getDate()
        );
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

  const handleSelectedDateChange = (date) => {
    // if date is undefined,
    // find the date in the pass dates and get the time from there

    if (date === undefined) {
      setSelectedDate(undefined);
      setDateRange({ start: undefined, end: undefined });
    } else {
      const datetime = passDates.find(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      );
      setSelectedDate(date);
      console.log('ddd running handleSelectedDateChange', datetime, passDates);
      console.log('uuu dateRnage has changed inside handleSelectedDate', date);
      setDateRange({ start: datetime, end: datetime });
      handlePassDates;
    }
  };

  // //whenever pass dates changes, update the layer dates change
  // useEffect(() => {
  //   console.log('ddd pass dates has changed', passDates);
  //   handleLayerDatesChange(passDates);
  // }, [passDates]);

  // get bbox from viewport of map and call getSatellitePassDates
  //  and store all dates in a state
  // create a function handlePassDates

  const handlePassDates = useCallback(
    (options) => {
      console.log('ddd inside handlePassDates. options', options);
      if (!mapInstance) {
        console.log('ddd no map instance found to load available dates');
        return;
      }

      if (mapInstance?.getZoom() < 9) {
        console.log('ddd layer is not visible or zoom is smaller than 9');
        setPassDates([]);
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
        return;
      }

      // if layer and bbox  is not changed, don't fetch dates
      if (!options?.layerChanged && previousBbox?.length > 0) {
        if (!hasBboxChanged(previousBbox, bbox)) {
          setPreviousBbox(bbox);
          console.log('bbox has not changed significantly');
          return;
        }
      }

      setPreviousBbox(bbox);

      // Cancel the previous request
      if (abortControllerRef.current) {
        console.log('aborting..');
        abortControllerRef.current.abort();
      }

      // Create a new abort controller for the new request
      const controller = new AbortController();
      const { signal } = controller;
      abortControllerRef.current = controller;

      setDatesLoading(true);

      const fetchDates = rasterLayer?.getAvailableDates
        ? rasterLayer.getAvailableDates(bbox)
        : getSatellitePassDates({ aoi: bbox, accessToken });

      fetchDates
        .then((dates) => {
          if (signal.aborted) {
            console.log('Request was aborted, ignoring response');
            return;
          }
          console.log('ddd setting pass dates', dates);
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

  if (!mapRef) {
    mapRef = mapRefContext;
  }

  return (
    <div className={`available-dates-calender ${compact && 'm-1'}`}>
      {!compact && (
        <h4 className="text-base flex gap-3 font-medium tracking-tight ">
          <CalenderIcon />
          {intl.formatMessage({
            id: 'app.agviewer_map.available_days',
            defaultMessage: 'Available Days',
          })}{' '}
          {datesLoading && <Spinner size="small" />}
        </h4>
      )}
      <Card className="flex items-center justify-center">
        <DayPicker
          mode="single"
          timeZone="UTC"
          selected={selectedDate}
          classNames={{
            months: 'rdp-months justify-center',
          }}
          onSelect={handleSelectedDateChange}
          modifiers={{
            disabled: isDayDisabled(passDates), // Pass the function here
            available: timeZonePassDates,
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
  );
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
