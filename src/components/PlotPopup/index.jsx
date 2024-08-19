import { Popup } from 'react-map-gl/maplibre';
import './styles.css';
import MyButton from '../../ui-components/MyButton';
import LabelValueList from '../../ui-components/LabelValueList';
import { calculatePolygonArea } from '../../utils/calculatePolygonArea';
import { area, bbox } from '@turf/turf';
import NdviChart from '../PlotNDVIChart';
import { useContext, useEffect, useState } from 'react';
import { PlotContext } from '@/contexts/PlotContext';
import fetchNDVIImage from '@/utils/fetchNDVIFromProcessingAPI';
import { getSatellitePassDates } from '@/api/sentinalHubApi';
import useAccessToken from '@/hooks/useAccessToken';
import { MapContext } from '@/contexts/MapContext';

export default function PlotPopup({ popupInfo, onClose }) {
  const { mapInstance } = useContext(MapContext);
  const { showPlots, clickedPlot } = useContext(PlotContext);
  const [weeksBefore, setWeeksBefore] = useState(0);
  const accessToken = useAccessToken();
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

  return (
    <Popup
      longitude={popupInfo.lngLat.lng}
      latitude={popupInfo.lngLat.lat}
      closeButton={true}
      closeOnClick={true}
      onClose={onClose}
      anchor='top'
      style={{ width: 240 }}
      className='plot-popup overflow-y-hidden max-h-96'
    >
      <div className='popup-header dark:text-gray-100 font-black text-[14px]'>
        <h3>{plot.properties.name}</h3>
      </div>
      <hr />
      <div className='popup-content '>
        <LabelValueList
          list={[
            {
              label: 'Area (sqm)',
              value: area(plot).toFixed(2),
            },
            // { label: 'Average NDVI', value: 0.3 },
            { label: 'Crop', value: 'Potato' },
            {
              variant: 'collapsable',
              label: 'NDVI Image',
              value: (
                <>
                  <input
                    type='range'
                    min='0'
                    max='52'
                    value={weeksBefore}
                    onChange={(e) => setWeeksBefore(e.target.value)}
                    style={{ direction: 'rtl' }}
                    className='w-full'
                  />
                  <span className='flex flex-row justify-between items-center'>
                    {new Date(
                      new Date().setDate(new Date().getDate() - weeksBefore * 7)
                    ).toLocaleDateString()}
                    <MyButton onClick={handleNDVIImageDownload}>
                      download
                    </MyButton>
                  </span>
                </>
              ),
            },
            {
              variant: 'collapsable',
              label: 'NDVI',
              value: <NdviChart plot={plot} />,
            },
          ]}
        />
      </div>
    </Popup>
  );
}
