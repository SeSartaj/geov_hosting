import { useCallback, useContext } from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { BiCross, BiTrash } from 'react-icons/bi';
import { MarkersContext } from '../../contexts/markersContext';
import HumidityChart from '../MarkerChart';
import './styles.css';
import LabelValueList from '../../ui-components/LabelValueList';
import { getStationMarkerColor } from '../../utils/getStationMarkerColor';
import Badge from '../../ui-components/Badge';
import MyButton from '@/ui-components/MyButton';
import Tooltip from '@/ui-components/Tooltip';
import { ArrowUpRightIcon } from '@/icons/arrow-up-right';
import EditMarkerModal from '../MarkerPanel/edit';
import { MapContext } from '@/contexts/MapContext';
import useConfirm from '@/hooks/useConfirm';
import { CrossIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import useMapStore from '@/stores/mapStore';
import { useIntl } from 'react-intl';

export default function MarkerPopup() {
  const { showMarkers } = useContext(MarkersContext);
  const intl = useIntl();

  const clickedMarker = useMapStore((state) => state.clickedMarker);
  const setClickedMarker = useMapStore((state) => state.setClickedMarker);

  const { mapRef } = useContext(MapContext);

  const { handleDeleteMarker } = useContext(MarkersContext);
  const { isConfirmed } = useConfirm();

  const _onFlyMarker = () => {
    if (!mapRef?.current) return;
    const { lat, lng } = clickedMarker?.location;
    mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
  };

  const _onDeleteMarker = useCallback(
    async (e) => {
      const markerId = e.currentTarget.getAttribute('data-marker-id');
      const confirmed = await isConfirmed('Do you want to delete this marker?');
      if (!confirmed) return;
      handleDeleteMarker(markerId);
    },
    [isConfirmed]
  );

  const closePopup = () => {
    console.log('setClickedMarker closePopup');
    setClickedMarker(null);
  };

  console.log('marker popup exists', clickedMarker);

  if (!clickedMarker || !showMarkers) return null;
  console.log('marker popup exists', clickedMarker);

  return (
    <Popup
      anchor="top"
      longitude={Number(clickedMarker.location.lng)}
      latitude={clickedMarker.location.lat}
      closeButton={false}
      closeOnClick={true}
      onClose={closePopup}
      className="!max-w-[480px] sm:!max-w-[270px] lg:!max-w-[480px]"
    >
      <div className="flex gap-2 items-center dark:text-gray-100 font-black text-[14px]">
        <h3 className="text-wrap">{clickedMarker?.title}</h3>
        <span className="flex items-center gap-1">
          <Tooltip
            text={intl.formatMessage({
              id: 'app.agviewer_map.delete_marker',
              defaultMessage: 'Delete Marker',
            })}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={_onDeleteMarker}
              data-marker-id={clickedMarker?.id}
              tabIndex={-1}
              disabled={true}
            >
              <BiTrash className="w-5 h-5 action-icon text-red-500 " />
            </Button>
          </Tooltip>

          <EditMarkerModal
            marker={clickedMarker}
            buttonClassName="!rounded-md !border !border-solid !border-[#D1D5DB] dark:!border-gray-200 !bg-inherit"
          />
          <Tooltip
            text={intl.formatMessage({
              id: 'app.agviewer_map.close',
              defaultMessage: 'Close',
            })}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={closePopup}
              tabIndex={-1}
            >
              <XIcon className="w-5 h-5 action-icon " />
            </Button>
          </Tooltip>
        </span>
      </div>
      {clickedMarker.type === 'station' ? (
        <StationPopupContent
          marker={clickedMarker}
          closePopup={() => {
            console.log('setClickedMarker StationPopupContent');

            setClickedMarker(null);
          }}
        />
      ) : (
        <ForeCastPopupContent
          marker={clickedMarker}
          closePopup={() => {
            console.log('setClickedMarker ForeCastPopupContent');
            setClickedMarker(null);
          }}
        />
      )}
    </Popup>
  );
}

function StationPopupContent({ marker, closePopup }) {
  const intl = useIntl();

  return (
    <div>
      <HumidityChart marker={marker} />
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800 p-2">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            {intl.formatMessage({
              id: 'app.agviewer_map.battery',
              defaultMessage: 'Battery',
            })}
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {marker.battery.percentage}%
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800 p-2">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            {intl.formatMessage({
              id: 'app.agviewer_map.paw_status',
              defaultMessage: 'PAW Status',
            })}
          </h4>
          <div className="flex items-center space-x-2">
            <Badge color={getStationMarkerColor(marker.paw_status)}>
              {marker.paw_status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800 p-2">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            {intl.formatMessage({
              id: 'app.agviewer_map.avg_paw',
              defaultMessage: 'Average PAW',
            })}
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {marker.avg_paw}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800 p-2">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            {intl.formatMessage({
              id: 'app.agviewer_map.crop',
              defaultMessage: 'Crop',
            })}
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {marker.crop}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForeCastPopupContent({ marker }) {
  return (
    <div>
      <div className="popup-header">
        <h3>{marker.title}</h3>
      </div>
      <hr />
    </div>
  );
}
