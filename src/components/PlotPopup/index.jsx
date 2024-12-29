import { Popup } from 'react-map-gl/maplibre';
import './styles.css';
import MyButton from '../../ui-components/MyButton';
import { area } from '@turf/turf';
import NdviChart from '../PlotNDVIChart';
import { useCallback, useContext, useMemo } from 'react';
import { PlotContext } from '@/contexts/PlotContext';
import { BiTrash } from 'react-icons/bi';

import Tooltip from '@/ui-components/Tooltip';
import useConfirm from '@/hooks/useConfirm';
import { EditPlotModal } from './edit';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/button';

export default function PlotPopup({ popupInfo, onClose }) {
  const { showPlots, plots, clickedPlot, handleDeletePlot } =
    useContext(PlotContext);
  const { isConfirmed } = useConfirm();
  const { plot } = popupInfo;

  const findPlot = useMemo(() => {
    return plots?.find((p) => p?.options?.id === plot?.properties?.id);
  }, [plot?.properties?.id, plots]);

  const _onDeletePlot = useCallback(async () => {
    const confirmed = await isConfirmed('Do you want to delete this marker?');
    if (!confirmed) return;
    handleDeletePlot(findPlot);
  }, [findPlot, isConfirmed]);

  return !showPlots || !clickedPlot ? null : (
    <Popup
      longitude={popupInfo.lngLat.lng}
      latitude={popupInfo.lngLat.lat}
      closeButton={false}
      closeOnClick={true}
      onClose={onClose}
      anchor="top"
      style={{ width: 240 }}
      className="plot-popup overflow-y-hidden"
    >
      <div className="flex flex-col gap-1 items-center dark:text-gray-100 font-black text-[14px]">
        <div className="w-full flex justify-between items-center dark:text-gray-100 font-black text-[14px]">
          <h3 className="text-wrap">{plot.properties.name}</h3>
          <span className="flex items-center gap-1">
            {/* <Tooltip text="click to delete the marker"> */}
            <MyButton
              variant="icon"
              className="rounded-md !border !border-solid !border-[#D1D5DB] dark:!border-gray-200 !bg-inherit"
              onClick={_onDeletePlot}
              data-marker-id={plot?.id}
            >
              <BiTrash className="w-5 h-5 action-icon text-red-500" />
            </MyButton>
            {/* </Tooltip> */}
            <EditPlotModal plot={findPlot} />
            <Tooltip text="close popup">
              <Button variant="outline" size="sm" onClick={onClose}>
                <XIcon className="w-5 h-5 action-icon " />
              </Button>
            </Tooltip>
          </span>
        </div>
        <hr />
        <div className="w-[calc(100%+4px)]">
          <NdviChart plot={plot} />
        </div>
        <div className="w-full flex flex-col items-center gap-3">
          <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-50 dark:bg-zinc-800 p-2">
            <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
              Area (sqm)
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-700 dark:text-gray-200">
                {area(plot).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-50 dark:bg-zinc-800 p-2">
            <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
              Crop
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-700 dark:text-gray-200">
                Potato
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-50 dark:bg-zinc-800 p-2">
            <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
              NDVI Image
            </h4>
            <span className="flex flex-row justify-between items-center">
              {new Date(
                new Date().setDate(new Date().getDate() - 0 * 7)
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Popup>
  );
}
