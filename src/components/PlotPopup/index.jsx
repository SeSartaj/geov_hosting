import { Popup } from 'react-map-gl/maplibre';
import './styles.css';
import MyButton from '../../ui-components/MyButton';
import { area } from '@turf/turf';
import NdviChart from '../PlotNDVIChart';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PlotContext } from '@/contexts/PlotContext';
import { BiTrash } from 'react-icons/bi';

import Tooltip from '@/ui-components/Tooltip';
import useConfirm from '@/hooks/useConfirm';
import { EditPlotModal } from './edit';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import Spinner from '@/ui-components/Spinner';
import { toast } from 'sonner';
import { getRunningTasksCount, getTaskCount } from '@/api/plotApi';
import { useIntl } from 'react-intl';

export default function PlotPopup({ popupInfo, onClose }) {
  const { showPlots, plots, clickedPlot, handleDeletePlot } =
    useContext(PlotContext);
  const { isConfirmed } = useConfirm();
  const { plot } = popupInfo;
  console.log('clickedPlot', clickedPlot);
  console.log('clickedPlot popupInfo', popupInfo);
  const [deletingPlot, setDeletingPlot] = useState(false);
  const [runningTasksCount, setRunningTasksCount] = useState(0);
  const [tasksStats, setTasksStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();

  const findPlot = useMemo(() => {
    return plots?.find((p) => p?.options?.id === plot?.properties?.id);
  }, [plot?.properties?.id, plots]);

  const _onDeletePlot = useCallback(async () => {
    const confirmed = await isConfirmed(
      intl.formatMessage({
        id: 'app.agviewer_map.plot_deletion_confirm_message',
        defaultMessage: 'Do you want to delete this plot?',
      })
    );
    if (!confirmed) return;
    setDeletingPlot(true);
    handleDeletePlot(findPlot).finally(() => {
      setDeletingPlot(false);
    });
  }, [findPlot, isConfirmed]);

  useEffect(() => {
    setIsLoading(true);
    if (findPlot) {
      getTaskCount({
        stationId: findPlot?.device,
        plotId: findPlot?.id,
      })
        .then((stats) => {
          console.log('et-tasks', stats);
          setTasksStats(stats);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [findPlot]);

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
          <h3 className="text-wrap">{findPlot.name}</h3>
          <span className="flex items-center gap-1">
            <Tooltip
              text={intl.formatMessage({
                id: 'app.agviewer_map.delete',
                defaultMessage: 'Delete',
              })}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={_onDeletePlot}
                data-marker-id={findPlot?.id}
              >
                {deletingPlot ? (
                  <Spinner size="small" />
                ) : (
                  <BiTrash className="w-5 h-5 action-icon text-red-500" />
                )}
              </Button>
            </Tooltip>
            <EditPlotModal plot={findPlot} />
            <Tooltip
              text={intl.formatMessage({
                id: 'app.agviewer_map.close',
                defaultMessage: 'Close',
              })}
            >
              <Button variant="outline" size="icon" onClick={onClose}>
                <XIcon className="w-5 h-5 action-icon " />
              </Button>
            </Tooltip>
          </span>
        </div>
        <hr />
        <div className="w-[calc(100%+4px)]">
          <NdviChart plot={plot} />
        </div>
        <div className="w-full flex flex-col items-center gap-1">
          <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800 p-2">
            <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
              {intl.formatMessage(
                {
                  id: 'app.agviewer_map.area',
                  defaultMessage: 'Area ({unit})',
                },
                { unit: 'sqm' }
              )}
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-700 dark:text-gray-200">
                {area(plot).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800 p-2">
            <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
              {intl.formatMessage({
                id: 'app.agviewer_map.sat-et',
                defaultMessage: 'SAT-ET',
              })}
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-700 dark:text-gray-200">
                {findPlot?.enable_satellite_et ? 'enabled' : 'disabled'}
              </span>
            </div>
          </div>
          {findPlot?.device && (
            <>
              <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800 p-2">
                <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
                  running tasks
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-700 dark:text-gray-200">
                    {isLoading && <Spinner size="small" />}
                    {!isLoading && tasksStats?.running | 0}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800 p-2">
                <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
                  pending tasks
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-700 dark:text-gray-200">
                    {isLoading && <Spinner size="small" />}
                    {!isLoading && tasksStats?.pending | 0}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Popup>
  );
}
