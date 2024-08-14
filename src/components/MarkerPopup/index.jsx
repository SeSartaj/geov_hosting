import { useContext, useState } from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { MarkersContext } from '../../contexts/markersContext';
import HumidityChart from '../MarkerChart';
import BatteryIndicator from '../../ui-components/BatteryIndicator';
import './styles.css';
import LabelValueList from '../../ui-components/LabelValueList';
import { getStationMarkerColor } from '../../utils/getStationMarkerColor';
import Badge from '../../ui-components/Badge';

export default function MarkerPopup() {
  const { clickedMarker, setClickedMarker } = useContext(MarkersContext);

  if (!clickedMarker) return null;

  return (
    <Popup
      anchor='top'
      longitude={Number(clickedMarker.location.lng)}
      latitude={clickedMarker.location.lat}
      onClose={() => setClickedMarker(null)}
      style={{ width: 240 }}
    >
      {clickedMarker.type === 'station' ? (
        <StationPopupContent marker={clickedMarker} />
      ) : (
        <ForeCastPopupContent marker={clickedMarker} />
      )}
    </Popup>
  );
}

function StationPopupContent({ marker }) {
  return (
    <div>
      <div className='popup-header dark:text-gray-100 font-black text-[14px]'>
        <h3>{marker.title}</h3>
        <BatteryIndicator level={marker.battery.percentage} />
      </div>
      <hr />
      <div className='popup-content'>
        <LabelValueList
          list={[
            {
              label: 'PAW Status',
              value: (
                <Badge color={getStationMarkerColor(marker.paw_status)}>
                  {marker.paw_status}
                </Badge>
              ),
            },
            { label: 'Average PAW', value: marker.avg_paw },
            { label: 'Crop', value: marker.crop },
          ]}
        />
        <span className='lvi-label dark:text-gray-400'>PAW history: </span>
        <HumidityChart marker={marker} />
      </div>
    </div>
  );
}

function ForeCastPopupContent({ marker }) {
  return (
    <div>
      <div className='popup-header'>
        <h3>{marker.title}</h3>
        <BatteryIndicator level={marker.battery.percentage} />
      </div>
      <hr />
    </div>
  );
}
