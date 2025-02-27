import { useCallback, useContext, useEffect, useState } from 'react';
import { MarkersContext } from '../../contexts/markersContext';
import './styles.css';
import Label from '@/ui-components/Label';
import ToggleButton from '@/ui-components/toggleButton';
import { RadioGroup, RadioGroupItem } from '@/ui-components/RadioGroup';
import MyReactSelect from '@/ui-components/MyReactSelect';
import MarkerPlots from './plots';
import { PlotContext } from '@/contexts/PlotContext';
import PlotSearch from './plotSearch';
import FormGroup from '@/ui-components/FormGroup';
import { getFarmOptions } from '@/api/farmApi';
import useMapStore from '@/stores/mapStore';
import { MapContext } from '@/contexts/MapContext';
import { useIntl } from 'react-intl';


export default function MarkerPanel() {
  const { mapRef } = useContext(MapContext);
  const intl = useIntl();

  const markerOptions = [
    {
      value: '',
      label: intl.formatMessage({ id: 'app.agviewer_map.all', defaultMessage: 'All' }),
    },
    {
      value: 'OPTIMAL',
      label: intl.formatMessage({ id: 'app.agviewer_map.optimal', defaultMessage: 'Optimal' }),
    },
    {
      value: 'STRESS_START',
      label: intl.formatMessage({ id: 'app.agviewer_map.stress_start', defaultMessage: 'Stress Start' }),
    },
    {
      value: 'SEVERE_STRESS',
      label: intl.formatMessage({ id: 'app.agviewer_map.severe_stress', defaultMessage: 'Severe Stress' }),
    },
    {
      value: 'EXCESS_WATER',
      label: intl.formatMessage({ id: 'app.agviewer_map.excess_water', defaultMessage: 'Excess Water' }),
    },
  ];

  const {
    markers,
    markerFilters,
    setMarkerFilters,
    showMarkers,
    setShowMarkers,
    unfilteredMarkers,
  } = useContext(MarkersContext);
  const { showPlots, setShowPlots } = useContext(PlotContext);

  const _onSelectMarker = useCallback(
    (o) => {
      console.log('on select marker', o);
      setMarkerFilters({ ...markerFilters, paw_status: o?.value });
    },
    [markerFilters, setMarkerFilters]
  );

  const _onSelectRadioGroup = useCallback(
    (value) => {
      setMarkerFilters({ ...markerFilters, type: value });
    },
    [markerFilters, setMarkerFilters]
  );

  const [farmsLoading, setFarmsLoading] = useState(false);
  const [farmOptions, setFarmOptions] = useState([]);

  useEffect(() => {
    setFarmsLoading(true);

    getFarmOptions()
      .then((options) => {
        console.log('farm', options);
        setFarmOptions(options);
      })
      .finally(() => {
        setFarmsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-2 rounded-md bg-zinc-50 dark:bg-zinc-800 p-2">
        <div className="flex items-center justify-between">
          <h4 className="text-base dark:text-gray-100 tracking-tight">
            {intl.formatMessage({ id: 'app.agviewer_map.stations', defaultMessage: 'Stations' })}
          </h4>
          <div className="flex items-center space-x-2">
            <RadioGroup
              defaultValue=""
              className="flex items-center gap-2"
              onValueChange={_onSelectRadioGroup}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="" id="all" />
                <Label htmlFor="all">{intl.formatMessage({ id: 'app.agviewer_map.all', defaultMessage: 'All' })}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="station" id="station" />
                <Label htmlFor="station">{intl.formatMessage({ id: 'app.agviewer_map.station', defaultMessage: 'Station' })}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="forecast" id="forecast" />
                <Label htmlFor="forecast">{intl.formatMessage({ id: 'app.agviewer_map.forecast', defaultMessage: 'Forecast' })}</Label>
              </div>
            </RadioGroup>
            <ToggleButton
              onTooltip={intl.formatMessage({ id: 'app.agviewer_map.hide_markers', defaultMessage: 'Hide Markers' })}
              offTooltip={intl.formatMessage({ id: 'app.agviewer_map.show_markers', defaultMessage: "Show Markers" })}
              value={showMarkers}
              onChange={setShowMarkers}
            />
          </div>
        </div>
        <div className="flex items-center gap-0 justify-between">
          <FormGroup
            label={intl.formatMessage({ id: 'app.agviewer_map.paw_status', defaultMessage: "PAW Status" })}
            className="w-full items-between">
            <MyReactSelect
              onChange={_onSelectMarker}
              value={markerFilters.paw_status}
              options={markerOptions}
              isClearable={true}
            />
          </FormGroup>

          {/* <select
            value={markerFilters.farm_id}
            className="w-full py-2 px-3 dark:bg-gray-700 border border-solid border-[#D1D5DB] cursor-pointer dark:border-gray-200 rounded-md"
            onChange={(e) =>
              setMarkerFilters({ ...markerFilters, farm_id: e.target.value })
            }
          >
            {farmOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select> */}
          <FormGroup
            label={intl.formatMessage({ id: 'app.agviewer_map.farm', defaultMessage: "Farm" })}
            className="w-full items-between">
            <MyReactSelect
              value={markerFilters.farm_id}
              options={farmOptions}
              onChange={(op) => {
                setMarkerFilters({
                  ...markerFilters,
                  farm_id: op?.value || null,
                });

                // if filter cleared, don't try to fly
                if (op === null) {
                  return;
                }

                // Find the first marker whose farm_id matches the selected value
                const selectedMarker = unfilteredMarkers.find(
                  (marker) => marker?.farm?.id == op?.value
                );

                // If a matching marker is found, fly to its location
                if (
                  selectedMarker &&
                  selectedMarker?.lat &&
                  selectedMarker?.lng
                ) {
                  const map = mapRef.current.getMap();
                  map.flyTo({
                    center: [selectedMarker?.lng, selectedMarker?.lat], // Assuming `location` is [longitude, latitude]
                    essential: true, // This ensures the flyTo animation happens even if other interactions are occurring
                    zoom: 12, // Set the zoom level according to your preference
                  });
                }
              }}
              isLoading={farmsLoading}
              isClearable={true}
            />
          </FormGroup>
        </div>
        <MarkerPlots />
      </div>
      <div className="flex items-center justify-between rounded-md bg-zinc-50 dark:bg-zinc-800 gap-2 p-2">
        <div className="flex items-center w-full justify-between">
          <h4 className="text-base dark:text-gray-100 tracking-tight">{intl.formatMessage({ id: 'app.agviewer_map.plots', defaultMessage: "Plots" })}</h4>
          <ToggleButton
            onTooltip={intl.formatMessage({ id: 'app.agviewer_map.hide_plots', defaultMessage: "Hide Plots" })}
            offTooltip={intl.formatMessage({ id: 'app.agviewer_map.show_plots', defaultMessage: "Show Plots" })}
            value={showPlots}
            onChange={setShowPlots}
          />
        </div>
        <PlotSearch />
      </div>
    </div>
  );
}
