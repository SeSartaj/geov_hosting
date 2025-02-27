import { useCallback, useContext, useMemo, useState, useEffect } from 'react';
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
import PlotIcon from '@/icons/plot-icon';
import Input from '@/ui-components/Input';
import { PlotContext } from '@/contexts/PlotContext';
import { EditPlotModal } from '../PlotPopup/edit';
import debounce from '@/utils/debounce';
import { useIntl } from 'react-intl';

export default function PlotSearch() {
  const intl = useIntl();
  const [searchKeyword, setSearchKeyword] = useState('');
  const { mapRef } = useContext(MapContext);
  const [plotVisible, setPlotVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { plots, loading, handleDeletePlot, handleFlyToPlot, handleEditPlot } =
    useContext(PlotContext);

  const { isConfirmed } = useConfirm();

  const [debouncedSearch, setDebouncedSearch] = useState(searchKeyword);

  const [allPlots, setAllPlots] = useState([]);
  const [matchingPlots, setMatchingPlots] = useState([]);

  useEffect(() => {
    setMatchingPlots(plots.map((m) => transformMarker(m)));
    setAllPlots(plots.map((m) => transformMarker(m)));
  }, [plots]);

  // throttle the filtering to only once in 250 seconds
  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(handler); // Cleanup on unmount or when searchKeyword changes
  }, [searchKeyword]);

  const handleFiltering = (keyword) => {
    const ps = allPlots?.filter((plot) =>
      keyword
        ? plot?.name?.toLowerCase()?.includes(keyword.toLowerCase())
        : true
    );
    setMatchingPlots(ps);
  };

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

  const _onSearchPlot = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
    debounce(handleFiltering(e.target.value), 50);
  };

  return (
    <div className="flex items-center w-full">
      <ErrorBoundary>
        <MyModal
          open={plotVisible}
          setOpen={setPlotVisible}
          trigger={
            <div className="w-full border border-solid border-[#D1D5DB] cursor-pointer dark:border-gray-200 rounded-md p-2 flex items-center justify-between">
              <h5 className="scroll-m-20 text-sm font-medium tracking-tight">
                {intl.formatMessage({ id: 'app.agviewer_map.search_plots', defaultMessage: "Search Plots" })}
              </h5>
              <BiSearch className="w-5 h-5 action-icon text-gray-500" />
            </div>
          }
          onClose={_onChangePlotVisibility}
        >
          <Card
            header={
              <div className="flex items-center gap-2 justify-between mt-2">
                <div className="flex items-center gap-2">
                  <PlotIcon />
                  <h4 className="text-base dark:text-gray-100 tracking-tight">
                    {intl.formatMessage({ id: 'app.agviewer_map.plots', defaultMessage: "Plots" })}
                  </h4>
                </div>
                <Input
                  className="w-[210px] mr-14"
                  // 
                  placeholder={intl.formatMessage({ id: 'app.agviewer_map.search_plots', defaultMessage: "Search Plots" })}
                  value={searchKeyword}
                  onChange={handleKeywordChange}
                />
              </div>
            }
            className="border-none"
          >
            <div className='overflow-y-auto h-[400px]'>
              {loading || isLoading ? (
                <Spinner />
              ) : matchingPlots?.length > 0 ? (
                matchingPlots?.map((plot) => (
                  <div key={plot.id} className="marker-item rounded-md hover:bg-gray-50">
                    <div className="marker-item-info p-2">
                      <div className="flex justify-between items-center">
                        <h5 className="scroll-m-20 text-sm font-medium tracking-tight">
                          {plot?.name}
                        </h5>
                        <span className="flex items-center gap-1">
                          <Tooltip text={intl.formatMessage({ id: 'app.agviewer_map.focus_plot', defaultMessage: "Focus on the plot" })}>
                            <MyButton
                              variant="icon"
                              className="rounded-full"
                              onClick={(e) => {
                                setPlotVisible(false);
                                handleFlyToPlot(
                                  plot?.options?.geometry?.coordinates
                                );
                              }}
                              data-plot-id={plot.id}
                            >
                              <ArrowUpRightIcon />
                            </MyButton>
                          </Tooltip>
                          <Tooltip text={intl.formatMessage({ id: 'app.agviewer_map.delete_plot', defaultMessage: "Delete plot" })}>
                            <MyButton
                              variant="icon"
                              className="rounded-full"
                              onClick={() => {
                                handleDeletePlot(plot);
                              }}
                              data-plot-id={plot.id}
                            >
                              <BiTrash className="w-5 h-5 action-icon text-red-500 " />
                            </MyButton>
                          </Tooltip>

                          <EditPlotModal
                            plot={plots.find((p) => p.id === plot.id)}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-20 p-4">
                  <h5 className="text-gray-500">
                    {intl.formatMessage({ id: 'app.agviewer_map.no_plot_found', defaultMessage: "No Plots Found for keyword:" })}{searchKeyword}
                  </h5>
                </div>
              )}
            </div>
          </Card>
        </MyModal>
      </ErrorBoundary>
    </div>
  );
}
