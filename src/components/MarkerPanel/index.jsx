import { useCallback, useContext } from 'react';
import { MarkersContext } from '../../contexts/markersContext';
import './styles.css';
import Label from '@/ui-components/Label';
import ToggleButton from '@/ui-components/toggleButton';
import { RadioGroup, RadioGroupItem } from '@/ui-components/RadioGroup';
import MyReactSelect from '@/ui-components/MyReactSelect';
import MarkerPlots from './plots';
import { PlotContext } from '@/contexts/PlotContext';

const markerOptions = [
  {
    value: '',
    label: 'All',
  },
  {
    value: 'OPTIMAL',
    label: 'Optimal',
  },
  {
    value: 'STRESS_START',
    label: 'Stress Start',
  },
  {
    value: 'SEVERE_STRESS',
    label: 'Severe Stress',
  },
  {
    value: 'EXCESS_WATER',
    label: 'Excess Water',
  },
];

const farmOptions = [
  {
    value: '',
    label: 'All',
  },
  {
    value: '345',
    label: 'Farm 1',
  },
  {
    value: '346',
    label: 'Farm 2',
  },
];

export default function MarkerPanel() {
  const { markerFilters, setMarkerFilters, showMarkers, setShowMarkers } =
    useContext(MarkersContext);
  const { showNdviLayer, toggleNDVILayersVisibility } = useContext(PlotContext);

  const _onSelectMarker = useCallback(
    (e) => {
      console.log('on select marker', e);
      setMarkerFilters({ ...markerFilters, paw_status: e?.target?.value });
    },
    [markerFilters, setMarkerFilters]
  );

  const _onSelectRadioGroup = useCallback(
    (e) => {
      setMarkerFilters({ ...markerFilters, type: e?.target.value });
    },
    [markerFilters, setMarkerFilters]
  );

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-2 rounded-md bg-zinc-50 p-2">
        <div className="flex items-center justify-between">
          <h4 className="scroll-m-20 text-lg font-medium tracking-tight">
            Stations
          </h4>
          <div className="flex items-center space-x-2">
            <RadioGroup
              defaultValue=""
              className="flex items-center gap-2"
              onClick={_onSelectRadioGroup}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="" id="all" />
                <Label htmlFor="all">All</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="station" id="station" />
                <Label htmlFor="station">Station</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="forecast" id="forecast" />
                <Label htmlFor="forecast">Forecast</Label>
              </div>
            </RadioGroup>
            <ToggleButton
              onTooltip="hide markers"
              offTooltip="show markers"
              initialState={showMarkers}
              onToggle={setShowMarkers}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <select
            onChange={_onSelectMarker}
            value={markerFilters.paw_status}
            className="w-full py-2 px-3 dark:bg-gray-700"
          >
            {markerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={markerFilters.farm_id}
            className="w-full py-2 px-3 dark:bg-gray-700"
            onChange={(e) =>
              setMarkerFilters({ ...markerFilters, farm_id: e.target.value })
            }
          >
            {farmOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-md bg-zinc-50 gap-2 p-2">
        <div className="flex items-center w-full justify-between">
          <h4 className="scroll-m-20 text-lg font-medium tracking-tight">
            Plots
          </h4>
          <ToggleButton
            onTooltip="hide plots"
            offTooltip="show plots"
            initialState={showNdviLayer}
            onToggle={toggleNDVILayersVisibility}
          />
        </div>
        <MarkerPlots />
      </div>
    </div>
  );
}
