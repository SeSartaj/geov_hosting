import { useContext, useEffect, useState } from 'react';
import AddNewMarkerModal from '../AddNewMarkerModal';
import { MarkersContext } from '../../contexts/markersContext';
import './styles.css';
import { useMarkers } from '../../hooks/useMarkers';
import MyButton from '../../ui-components/MyButton';
import { MapContext } from '../../contexts/MapContext';

export default function MarkerPanel() {
  const { mapRef } = useContext(MapContext);
  const { markersData } = useContext(MarkersContext);
  const { markerFilters, setMarkerFilters, resetFilters } =
    useContext(MarkersContext);

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
    <div className='panel-container'>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Markers</h3>
        <AddNewMarkerModal />
      </div>

      <span>filter markers</span>
      <form>
        <label>type: </label>
        <select
          value={markerFilters.type}
          onChange={(e) =>
            setMarkerFilters({ ...markerFilters, type: e.target.value })
          }
        >
          <option value=''>all</option>
          <option value='station'>Station</option>
          <option value='forecast'>Forecast</option>
        </select>
        <br />
        <label>paw Status: </label>
        <select
          value={markerFilters.paw_status}
          onChange={(e) =>
            setMarkerFilters({ ...markerFilters, paw_status: e.target.value })
          }
        >
          <option value=''>All</option>
          <option value='OPTIMAL'>Optimal</option>
          <option value='STRESS_START'>Stress Start</option>
          <option value='SEVERE_STRESS'>Severe Stress</option>
          <option value='EXCESS_WATER'>Excess Water</option>
        </select>
        <br />
        <label>Farm: </label>
        <select
          value={markerFilters.farm_id}
          onChange={(e) =>
            setMarkerFilters({ ...markerFilters, farm_id: e.target.value })
          }
        >
          <option value=''>All</option>
          <option value='345'>Farm 1</option>
          <option value='346'>Farm 2</option>
        </select>
        <br />
      </form>
      <span>
        <MyButton size='sm' onClick={resetFilters}>
          reset filters
        </MyButton>
      </span>

      <hr />
      <div className='panel-content'>
        {markersData?.map((marker) => (
          <div key={marker.id} className='marker-item'>
            <div
              className='marker-item-info'
              data-marker-id={marker.id}
              onClick={handleMarkerClick}
              style={{ cursor: 'pointer' }}
            >
              <h4>{marker.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
