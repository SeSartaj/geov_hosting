import { Popup } from 'react-map-gl/maplibre';
import './styles.css';
import MyButton from '../../ui-components/MyButton';
import LabelValueList from '../../ui-components/LabelValueList';
import { area, bbox } from '@turf/turf';
import NdviChart from '../PlotNDVIChart';
import { useCallback, useContext, useEffect, useState } from 'react';
import { PlotContext } from '@/contexts/PlotContext';
import fetchNDVIImage from '@/utils/fetchNDVIFromProcessingAPI';
import { BiPencil, BiTrash } from 'react-icons/bi';

import { MapContext } from '@/contexts/MapContext';
import { AccessTokenContext } from '@/contexts/AccessTokenProvider';
import Tooltip from '@/ui-components/Tooltip';
import useConfirm from '@/hooks/useConfirm';

export default function PlotPopup({ popupInfo, onClose }) {
  const { mapInstance } = useContext(MapContext);
  const { showPlots, clickedPlot, handleEditPlot } = useContext(PlotContext);
  const [weeksBefore, setWeeksBefore] = useState(0);
  const accessToken = useContext(AccessTokenContext);
  const { isConfirmed } = useConfirm();
  const { plot } = popupInfo;

  const handleNDVIImageDownload = async () => {
    // clone the plot object to avoid mutating the original object
    const plot = JSON.parse(JSON.stringify(clickedPlot?.plot));

    const ndviDataUrl = await fetchNDVIImage(plot, {
      weeksBefore: weeksBefore,
      accessToken: accessToken,
    });

    if (ndviDataUrl) {
      // create a link and click it to download the image
      const link = document.createElement('a');
      link.href = ndviDataUrl;
      // include current date - weeks before in the name
      link.download = `${plot.properties.name}_${new Date(
        new Date().setDate(new Date().getDate() - weeksBefore * 7 - 14)
      ).toISOString()}__NDVI.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // if (!plot) throw new Error('plot is not defined');
    // if (ndviDataUrl) {
    //   addNDVIImageToMap(ndviDataUrl, plot);
    // }
    // Add the image to the map
  };

  const addNDVIImageToMap = (imageUrl, plot) => {
    console.log('plotss', plot);
    if (!plot || !plot.geometry || plot.geometry.type !== 'Polygon')
      return null;

    // const { geometry } = plot;

    // Calculate the bounding box [minX, minY, maxX, maxY]
    const [minX, minY, maxX, maxY] = bbox(plot.geometry);

    // Define the bounds of the image as the four corners of the bounding box
    const bounds = [
      [minX, maxY], // top-left corner
      [maxX, maxY], // top-right corner
      [maxX, minY], // bottom-right corner
      [minX, minY], // bottom-left corner
    ];
    // Check if the source and layer with the same id already exist
    const sourceId = `ndviImageSource-${plot.properties.id}`;
    const layerId = `ndviImageLayer-${plot.properties.id}`;

    if (mapInstance.getLayer(layerId)) {
      mapInstance.removeLayer(layerId);
    }

    if (mapInstance.getSource(sourceId)) {
      mapInstance.removeSource(sourceId);
    }

    // Add the image as a raster layer
    mapInstance.addSource(sourceId, {
      type: 'image',
      url: imageUrl,
      coordinates: bounds,
    });

    mapInstance.addLayer({
      id: layerId,
      type: 'raster',
      source: sourceId,
      paint: {
        'raster-opacity': 0.85,
      },
    });
  };

  if (!showPlots || !clickedPlot) return null;

  const _onDeletePlot = useCallback(async (e) => {
    // get marker id from data-marker-id attribute
    // ask for confirmatino whether to delete the marker or not?
    const confirmed = await isConfirmed('Do you want to delete this Plot?');
    console.log('confirmed', confirmed, e);
  }, []);

  return (
    <Popup
      longitude={popupInfo.lngLat.lng}
      latitude={popupInfo.lngLat.lat}
      closeButton={true}
      closeOnClick={true}
      onClose={onClose}
      anchor="top"
      style={{ width: 240 }}
      className="plot-popup gap-2 overflow-y-hidden"
    >
      <div className="flex flex-col gap-1 items-center dark:text-gray-100 font-black text-[14px]">
        <div className="w-full flex justify-between items-center dark:text-gray-100 font-black text-[14px]">
          <h3 className="text-wrap">{plot.properties.name}</h3>
          <span className="flex items-center gap-1">
            <Tooltip text="click to delete the marker">
              <MyButton
                variant="icon"
                className="rounded-md !border !border-solid !border-[#D1D5DB] dark:!border-gray-200 !bg-inherit"
                onClick={_onDeletePlot}
                data-marker-id={plot?.id}
              >
                <BiTrash className="w-5 h-5 action-icon text-red-500" />
              </MyButton>
            </Tooltip>

            <Tooltip text="click to edit the plot">
              <MyButton
                variant="icon"
                className="rounded-md !border !border-solid !border-[#D1D5DB] dark:!border-gray-200 !bg-inherit"
                onClick={() => handleEditPlot(plot)}
              >
                <BiPencil className="w-5 h-5 action-icon" />
              </MyButton>
            </Tooltip>
          </span>
        </div>
        <hr />
        <div className="w-[calc(100%+4px)]">
          <NdviChart plot={plot} />
        </div>
        <div className="flex flex-col items-center gap-3">
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
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="52"
                value={weeksBefore}
                onChange={(e) => setWeeksBefore(e.target.value)}
                style={{ direction: 'rtl' }}
                className="w-full"
              />
              <span className="flex flex-row justify-between items-center">
                {new Date(
                  new Date().setDate(new Date().getDate() - weeksBefore * 7)
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full gap-2 rounded-md bg-zinc-50 dark:bg-zinc-800 p-2">
            <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
              NDVI Download
            </h4>
            <MyButton onClick={handleNDVIImageDownload}>download</MyButton>
          </div>
        </div>
      </div>
    </Popup>
  );
}
