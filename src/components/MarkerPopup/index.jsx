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

export default function MarkerPopup() {
  const { clickedMarker, setClickedMarker, showMarkers } =
    useContext(MarkersContext);

  if (!clickedMarker || !showMarkers) return null;

  return (
    <Popup
      anchor="top"
      longitude={Number(clickedMarker.location.lng)}
      latitude={clickedMarker.location.lat}
      closeButton={false}
      onClose={() => setClickedMarker(null)}
      className="!max-w-[240px] sm:!max-w-[270px] lg:!max-w-[320px]"
    >
      {clickedMarker.type === 'station' ? (
        <StationPopupContent
          marker={clickedMarker}
          closePopup={() => setClickedMarker(null)}
        />
      ) : (
        <ForeCastPopupContent
          marker={clickedMarker}
          closePopup={() => setClickedMarker(null)}
        />
      )}
    </Popup>
  );
}

function StationPopupContent({ marker, closePopup }) {
  const { mapRef } = useContext(MapContext);

  const { handleDeleteMarker } = useContext(MarkersContext);
  const { isConfirmed } = useConfirm();

  const _onFlyMarker = () => {
    if (!mapRef?.current) return;
    const { lat, lng } = marker?.location;
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

  return (
    <div>
      <div className="flex gap-2 items-center dark:text-gray-100 font-black text-[14px]">
        <h3 className="text-wrap">{marker?.title}</h3>
        <span className="flex items-center gap-1">
          {/* <Tooltip text="delete the marker"> */}
          <Button
            variant="outline"
            size="icon"
            onClick={_onDeleteMarker}
            data-marker-id={marker?.id}
            tabIndex={-1}
          >
            <BiTrash className="w-5 h-5 action-icon text-red-500 " />
          </Button>
          {/* </Tooltip> */}

          <EditMarkerModal
            marker={marker}
            buttonClassName="!rounded-md !border !border-solid !border-[#D1D5DB] dark:!border-gray-200 !bg-inherit"
          />
          <Tooltip text="close popup">
            <Button variant="outline" size="icon" onClick={closePopup}>
              <XIcon className="w-5 h-5 action-icon " />
            </Button>
          </Tooltip>
        </span>
      </div>
      <HumidityChart marker={marker} />
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-50 dark:bg-zinc-800 p-2">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            Battery
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {marker.battery.percentage}%
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-50 dark:bg-zinc-800 p-2">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            PAW Status
          </h4>
          <div className="flex items-center space-x-2">
            <Badge color={getStationMarkerColor(marker.paw_status)}>
              {marker.paw_status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-50 dark:bg-zinc-800 p-2">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            Average PAW
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {marker.avg_paw}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-50 dark:bg-zinc-800 p-2">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            Crop
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

function ForeCastPopupContent({ marker, closePopup }) {
  return (
    <div>
      <div className="popup-header">
        <h3>{marker.title}</h3>
        <Tooltip text="close popup">
          <MyButton
            variant="icon"
            className="rounded-md !border !border-solid !border-[#D1D5DB] dark:!border-gray-200 !bg-inherit"
            onClick={closePopup}
            data-marker-id={marker?.id}
          >
            <XIcon className="w-5 h-5 action-icon text-red-500 " />
          </MyButton>
        </Tooltip>
      </div>
      <hr />
    </div>
  );
}
