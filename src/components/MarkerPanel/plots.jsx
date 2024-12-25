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

export default function MarkerPlots() {
  const [searchPlot, setSearchPlot] = useState('');
  const { mapRef } = useContext(MapContext);
  const [plotVisible, setPlotVisible] = useState(false);
  const {
    markers: markersData,
    loading,
    handleDeleteMarker,
  } = useContext(MarkersContext);
  const { isConfirmed } = useConfirm();
  const allMarkers = useMemo(() => {
    return markersData.map((m) => transformMarker(m));
  }, [markersData]);

  const markers = useMemo(() => {
    return allMarkers?.filter((marker) =>
      searchPlot
        ? marker?.title?.toLowerCase()?.includes(searchPlot?.toLowerCase())
        : true
    );
  }, [allMarkers, searchPlot]);

  const handleMarkerClick = (e) => {
    if (!mapRef?.current) return;
    const markerId = e.currentTarget.getAttribute('data-marker-id');
    const marker = markers.find((m) => m.id == markerId);
    if (!marker) return;
    const { lat, lng } = marker.location;
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
            <div className="w-full border border-solid border-gray-700 cursor-pointer dark:border-gray-200 rounded-md p-2 flex items-center justify-between">
              <h5 className="scroll-m-20 text-sm font-medium tracking-tight">
                Find Plot
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
                  <h4 className="scroll-m-20 text-lg font-medium tracking-tight">
                    Plots
                  </h4>
                </div>
                <Input
                  className="w-[210px] mr-8"
                  placeholder="Search for Plots"
                  onChange={_onSearchPlot}
                />
              </div>
            }
            className="border-none"
          >
            {loading ? (
              <Spinner />
            ) : markers?.length > 0 ? (
              markers?.map((marker) => (
                <div key={marker.id} className="marker-item">
                  <div className="marker-item-info p-2">
                    <div className="flex justify-between items-center">
                      <h5 className="scroll-m-20 text-sm font-medium tracking-tight">
                        {marker?.title}
                      </h5>
                      <span className="flex items-center gap-1">
                        <Tooltip text="click to fly the marker">
                          <MyButton
                            variant="icon"
                            className="rounded-full"
                            onClick={handleMarkerClick}
                            data-marker-id={marker.id}
                          >
                            <ArrowUpRightIcon />
                          </MyButton>
                        </Tooltip>
                        <Tooltip text="click to delete the marker">
                          <MyButton
                            variant="icon"
                            className="rounded-full"
                            onClick={_onDeleteMarker}
                            data-marker-id={marker.id}
                          >
                            <BiTrash className="w-5 h-5 action-icon text-red-500 " />
                          </MyButton>
                        </Tooltip>

                        <EditMarkerModal
                          marker={markersData.find((m) => m.id === marker.id)}
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
