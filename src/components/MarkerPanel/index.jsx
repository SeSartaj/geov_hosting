import { useContext, useEffect, useState } from 'react';
import { MarkersContext } from '../../contexts/markersContext';
import './styles.css';
import MyButton from '../../ui-components/MyButton';
import { MapContext } from '../../contexts/MapContext';
import InlineInputField from '@/ui-components/InlineInputField';
import Tooltip from '@/ui-components/Tooltip';
import { BiDotsVertical, BiPencil, BiReset, BiTrash } from 'react-icons/bi';
import ToggleButton from '@/ui-components/toggleButton';
import Spinner from '@/ui-components/Spinner';
import ErrorBoundary from '../ErrorBoundary';
import EditMarkerModal from '../EditMarkerModal';
import { transformMarker } from '@/utils/transformMarker';

export default function MarkerPanel() {
  const { mapRef } = useContext(MapContext);
  const {
    markers: markersData,
    markerFilters,
    setMarkerFilters,
    resetFilters,
    showMarkers,
    setShowMarkers,
    loading,
  } = useContext(MarkersContext);

  const markers = markersData.map((m) => transformMarker(m));

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMarkerClick = (e) => {
    if (!mapRef?.current) return;
    const markerId = e.currentTarget.getAttribute('data-marker-id');
    console.log(markerId);
    const marker = markers.find((m) => m.id == markerId);
    if (!marker) return;
    const { lat, lng } = marker.location;
    mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
  };

  return (
    <div className="panel-container">
      <div className="panel-header-action pb-3">
        <h3 className="text-lg">Markers</h3>
        {/* <AddNewMarkerModal /> */}
        <ToggleButton
          onTooltip="hide markers"
          offTooltip="show markers"
          initialState={showMarkers}
          onToggle={setShowMarkers}
        />
      </div>
      {/* 
      <div className='flex justify-between items-center '>
        <span className='text-base'>filter markers</span>
      </div> */}
      <form>
        <div className="flex flex-col gap-1 ">
          <InlineInputField label="type:">
            <select
              value={markerFilters.type}
              className="p-1 border border-gray-300 dark:bg-gray-700 w-2/4"
              onChange={(e) =>
                setMarkerFilters({ ...markerFilters, type: e.target.value })
              }
            >
              <option value="">all</option>
              <option value="station">Station</option>
              <option value="forecast">Forecast</option>
            </select>
          </InlineInputField>
          <InlineInputField label="PAW Status: ">
            <select
              className="p-1 border border-gray-300 dark:bg-gray-700 w-2/4"
              value={markerFilters.paw_status}
              onChange={(e) =>
                setMarkerFilters({
                  ...markerFilters,
                  paw_status: e.target.value,
                })
              }
            >
              <option value="">All</option>
              <option value="OPTIMAL">Optimal</option>
              <option value="STRESS_START">Stress Start</option>
              <option value="SEVERE_STRESS">Severe Stress</option>
              <option value="EXCESS_WATER">Excess Water</option>
            </select>
          </InlineInputField>
          <InlineInputField label="Farm:">
            <select
              className="p-1 border border-gray-300 dark:bg-gray-700 w-2/4"
              value={markerFilters.farm_id}
              onChange={(e) =>
                setMarkerFilters({ ...markerFilters, farm_id: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="345">Farm 1</option>
              <option value="346">Farm 2</option>
            </select>
          </InlineInputField>
        </div>
      </form>
      <span className="inline-flex w-full justify-between my-1">
        <span>count: {markers?.length || 0}</span>
        <Tooltip text="reset filters">
          <MyButton onClick={resetFilters} className="self-end" variant="icon">
            <BiReset />
          </MyButton>
        </Tooltip>
      </span>
      <div className="panel-content ">
        <ErrorBoundary>
          {loading ? (
            <Spinner />
          ) : (
            markers?.map((marker) => (
              <div key={marker.id} className="marker-item">
                <div className="marker-item-info p-2 border border-solid border-collapse dark:border-gray-500">
                  <h4 className="flex justify-between items-center">
                    <span
                      onClick={handleMarkerClick}
                      data-marker-id={marker.id}
                      style={{ cursor: 'pointer' }}
                    >
                      {marker.title}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tooltip text="click to delete the marker">
                        <MyButton variant="icon" className="rounded-full">
                          <BiTrash className="action-icon text-red-500 " />
                        </MyButton>
                      </Tooltip>

                      <Tooltip text="click to edit the marker">
                        <EditMarkerModal
                          marker={markersData.find((m) => m.id === marker.id)}
                        />
                      </Tooltip>

                      {/* <MyButton variant='icon' className="rounded rounded-full"> <BiDotsVertical /> </MyButton> */}
                    </span>
                  </h4>
                </div>
              </div>
            ))
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}
