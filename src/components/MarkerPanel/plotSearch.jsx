import { useCallback, useContext, useMemo, useState } from 'react';
import { MarkersContext } from '../../contexts/markersContext';
import './styles.css';
import { MapContext } from '../../contexts/MapContext';
import Tooltip from '@/ui-components/Tooltip';
import { BiSearch, BiTrash } from 'react-icons/bi';
import ErrorBoundary from '../ErrorBoundary';
import EditMarkerModal from './edit';
import { transformMarker } from '@/utils/transformMarker';
import useConfirm from '@/hooks/useConfirm';
import Spinner from '@/ui-components/Spinner';
import MyButton from '@/ui-components/MyButton';
import MyModal from '@/ui-components/MyModal';
import { ArrowUpRightIcon } from '@/icons/arrow-up-right';
import Card from '@/ui-components/Card';
import { SproutIcon } from '@/icons/sprout';
import Input from '@/ui-components/Input';
import { PlotContext } from '@/contexts/PlotContext';
import { EditPlotModal } from '../PlotPopup/edit';

export default function PlotSearch() {
  const [searchPlot, setSearchPlot] = useState('');
  const { mapRef } = useContext(MapContext);
  const [plotVisible, setPlotVisible] = useState(false);
  const { plots, loading, handleDeletePlot, handleFlyToPlot, handleEditPlot } =
    useContext(PlotContext);

  console.log('plots', plots);
  const { isConfirmed } = useConfirm();
  const allPlots = useMemo(() => {
    return plots.map((m) => transformMarker(m));
  }, [plots]);

  console.log('plots', plots);

  const foundPlots = useMemo(() => {
    return allPlots?.filter((plot) =>
      searchPlot
        ? plot?.name?.toLowerCase()?.includes(searchPlot?.toLowerCase())
        : true
    );
  }, [allPlots, searchPlot]);

  const handleMarkerClick = (e) => {
    if (!mapRef?.current) return;
    const plotId = e.currentTarget.getAttribute('data-plot-id');
    const plot = foundPlots.find((m) => m.id == plotId);
    if (!plot) return;
    const { lat, lng } = plot.location;
    handleFlyToPlot(plot.location);
  };

  const _onDeleteMarker = useCallback(
    async (e) => {
      const markerId = e.currentTarget.getAttribute('data-plot-id');
      const confirmed = await isConfirmed('Do you want to delete this marker?');
      if (!confirmed) return;
      handleDeleteMarker(markerId);
    },
    [isConfirmed]
  );

  const _onChangePlotVisibility = useCallback(() => {
    setPlotVisible((prev) => !prev);
  }, []);

  const _onSearchPlot = useCallback((e) => {
    setSearchPlot(e.target.value);
  }, []);

  return (
    <div className="flex items-center w-full">
      <ErrorBoundary>
        <MyModal
          open={plotVisible}
          setOpen={setPlotVisible}
          trigger={
            <div className="w-full border border-solid border-[#D1D5DB] cursor-pointer dark:border-gray-200 rounded-md p-2 flex items-center justify-between">
              <h5 className="scroll-m-20 text-sm font-medium tracking-tight">
                Search Plot
              </h5>
              <BiSearch className="w-5 h-5 action-icon text-gray-500" />
            </div>
          }
          onClose={_onChangePlotVisibility}
        >
          <Card
            header={
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <SproutIcon />
                  <h4 className="text-base dark:text-gray-100 tracking-tight">
                    Plots
                  </h4>
                </div>
                <Input
                  className="w-[210px] mr-8"
                  placeholder="Search Station"
                  onChange={_onSearchPlot}
                />
              </div>
            }
            className="border-none"
          >
            {loading ? (
              <Spinner />
            ) : foundPlots?.length > 0 ? (
              foundPlots?.map((marker) => (
                <div key={marker.id} className="marker-item">
                  <div className="marker-item-info p-2">
                    <div className="flex justify-between items-center">
                      <h5 className="scroll-m-20 text-sm font-medium tracking-tight">
                        {marker?.name}
                      </h5>
                      <span className="flex items-center gap-1">
                        <Tooltip text="click to fly the marker">
                          <MyButton
                            variant="icon"
                            className="rounded-full"
                            onClick={(e) => {
                              setPlotVisible(false);
                              handleFlyToPlot(
                                marker?.options?.geometry?.coordinates
                              );
                            }}
                            data-plot-id={marker.id}
                          >
                            <ArrowUpRightIcon />
                          </MyButton>
                        </Tooltip>
                        <Tooltip text="click to delete the marker">
                          <MyButton
                            variant="icon"
                            className="rounded-full"
                            onClick={handleDeletePlot}
                            data-plot-id={marker.id}
                          >
                            <BiTrash className="w-5 h-5 action-icon text-red-500 " />
                          </MyButton>
                        </Tooltip>

                        <EditPlotModal
                          plot={plots.find((m) => m.id === marker.id)}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-20 p-4">
                <h5 className="text-gray-500">No Plots Found</h5>
              </div>
            )}
          </Card>
        </MyModal>
      </ErrorBoundary>
    </div>
  );
}
