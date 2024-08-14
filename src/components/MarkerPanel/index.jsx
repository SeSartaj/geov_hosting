import { useContext, useEffect, useState } from 'react';
import AddNewMarkerModal from '../AddNewMarkerModal';
import { MarkersContext } from '../../contexts/markersContext';
import './styles.css';
import { useMarkers } from '../../hooks/useMarkers';
import MyButton from '../../ui-components/MyButton';
import { MapContext } from '../../contexts/MapContext';
import InlineInputField from '@/ui-components/InlineInputField';
import Tooltip from '../Tooltip';
import { BiReset } from 'react-icons/bi';
import ToggleButton from '@/ui-components/toggleButton';

export default function MarkerPanel() {
  const { mapRef } = useContext(MapContext);
  const {
    markersData,
    markerFilters,
    setMarkerFilters,
    resetFilters,
    showMarkers,
    setShowMarkers,
  } = useContext(MarkersContext);

  const handleMarkerClick = (e) => {
    if (!mapRef?.current) return;
    const markerId = e.currentTarget.getAttribute('data-marker-id');
    console.log(markerId);
    const marker = markersData.find((m) => m.id == markerId);
    if (!marker) return;
    const { lat, lng } = marker.location;
    mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
  };

  return (
    <>
      <div className='panel-header-action pb-3'>
        <h3 className='text-lg'>Markers</h3>
        {/* <AddNewMarkerModal /> */}
        <ToggleButton
          onTooltip='hide markers'
          offTooltip='show markers'
          initialState={showMarkers}
          onToggle={setShowMarkers}
        />
      </div>
      {/* 
      <div className='flex justify-between items-center '>
        <span className='text-base'>filter markers</span>
      </div> */}
      <form>
        <div className='flex flex-col gap-1'>
          <InlineInputField label='type:'>
            <select
              value={markerFilters.type}
              className='p-1 border border-gray-300 dark:bg-gray-700'
              onChange={(e) =>
                setMarkerFilters({ ...markerFilters, type: e.target.value })
              }
            >
              <option value=''>all</option>
              <option value='station'>Station</option>
              <option value='forecast'>Forecast</option>
            </select>
          </InlineInputField>
          <InlineInputField label='PAW Status: '>
            <select
              className='p-1 border border-gray-300 dark:bg-gray-700'
              value={markerFilters.paw_status}
              onChange={(e) =>
                setMarkerFilters({
                  ...markerFilters,
                  paw_status: e.target.value,
                })
              }
            >
              <option value=''>All</option>
              <option value='OPTIMAL'>Optimal</option>
              <option value='STRESS_START'>Stress Start</option>
              <option value='SEVERE_STRESS'>Severe Stress</option>
              <option value='EXCESS_WATER'>Excess Water</option>
            </select>
          </InlineInputField>
          <InlineInputField label='Farm:'>
            <select
              className='p-1 border border-gray-300 dark:bg-gray-700'
              value={markerFilters.farm_id}
              onChange={(e) =>
                setMarkerFilters({ ...markerFilters, farm_id: e.target.value })
              }
            >
              <option value=''>All</option>
              <option value='345'>Farm 1</option>
              <option value='346'>Farm 2</option>
            </select>
          </InlineInputField>
        </div>
      </form>
      <span className='inline-flex w-full justify-end'>
        <MyButton onClick={resetFilters} className='self-end' variant='icon'>
          <Tooltip text='reset form'>
            <BiReset />
          </Tooltip>
        </MyButton>
      </span>

      <div className='panel-content'>
        {markersData?.map((marker) => (
          <div key={marker.id} className='marker-item'>
            <div
              className='marker-item-info p-2 border border-solid border-collapse dark:border-gray-500'
              data-marker-id={marker.id}
              onClick={handleMarkerClick}
              style={{ cursor: 'pointer' }}
            >
              <h4>{marker.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
