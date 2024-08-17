import { Popup } from 'react-map-gl/maplibre';
import './styles.css';
import MyButton from '../../ui-components/MyButton';
import LabelValueList from '../../ui-components/LabelValueList';
import { calculatePolygonArea } from '../../utils/calculatePolygonArea';
import { area } from '@turf/turf';
import NdviChart from '../PlotNDVIChart';
import { useContext, useEffect, useState } from 'react';
import { PlotContext } from '@/contexts/PlotContext';
import fetchNDVIImage from '@/utils/fetchNDVIFromProcessingAPI';

export default function PlotPopup({ popupInfo, onClose }) {
  const { plot } = popupInfo;
  const { showPlots, clickedPlot } = useContext(PlotContext);
  const [weeksBefore, setWeeksBefore] = useState(0);

  const handleNDVIImageDownload = async () => {
    const ndviDataUrl = await fetchNDVIImage(plot, {
      weeksBefore: weeksBefore,
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
            { label: 'Average NDVI', value: 0.3 },
            { label: 'Crop', value: 'Potato' },
            {
              label: 'NDVI URL',
              value: (
                <>
                  <input
                    type='range'
                    min='0'
                    max='52'
                    value={weeksBefore}
                    onChange={(e) => setWeeksBefore(e.target.value)}
                    style={{ direction: 'rtl' }}
                  />
                  {new Date(
                    new Date().setDate(new Date().getDate() - weeksBefore * 7)
                  ).toLocaleDateString()}
                  <MyButton onClick={handleNDVIImageDownload}>
                    download
                  </MyButton>
                </>
              ),
            },
          ]}
        />
        <span className='lvi-label'>NDVI history: </span>
        <NdviChart plot={plot} />
      </div>
    </Popup>
  );
}
