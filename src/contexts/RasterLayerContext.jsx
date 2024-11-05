import { createContext, useState, useEffect, useContext } from 'react';
import { parseDate } from '@internationalized/date';
import { MapContext } from './MapContext';
import { layerOptions } from '@/constants';

export const RasterLayerContext = createContext(null);

export function RasterLayerProvider({ children }) {
  const { mapInstance } = useContext(MapContext);
  const [layer, setLayer] = useState(layerOptions[0]);
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(100);
  const [isDetailActive, setIsDetailActive] = useState(false);
  const [datesLoading, setDatesLoading] = useState(false);
  // const [dateRange, setDateRange] = useState({
  //   start: parseDate(
  //     new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  //       .toISOString()
  //       .split('T')[0]
  //   ),
  //   end: parseDate(new Date().toISOString().split('T')[0]),
  // });
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [clickedData, setClickedData] = useState(null);

  const handleOpacityChange = (e) => {
    setOpacity(e.target.value);
  };

  const handleStateChange = (isActive) => {
    if (mapInstance) {
      if (isActive) {
        mapInstance.getCanvas().style.cursor = 'crosshair';
      } else {
        mapInstance.getCanvas().style.cursor = '';
      }
    }
    setIsDetailActive(isActive);
  };

  useEffect(() => {
    const handleClick = (e) => {
      let data = {
        coordinates: e.lngLat,
      };

      // clicked inside a plot
      if (mapInstance.getLayer('plots-layer')) {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: ['plots-layer'],
        });
        if (features.length > 0) {
          data.plot = features[0];
        }
      }
      setClickedData(data);
    };
    if (mapInstance && isDetailActive) {
      console.log('adding event to map');
      mapInstance.on('click', handleClick);
    }

    // Clean up the event listener on component unmount
    return () => {
      if (mapInstance) {
        mapInstance.off('click', handleClick);
      }
    };
  }, [mapInstance, isDetailActive, setClickedData]);

  return (
    <RasterLayerContext.Provider
      value={{
        layer,
        setLayer,
        opacity,
        setOpacity,
        handleOpacityChange,
        layerOptions,
        dateRange,
        setDateRange,
        isVisible,
        setIsVisible,
        clickedData,
        setClickedData,
        isDetailActive,
        handleStateChange,
        datesLoading,
        setDatesLoading,
      }}
    >
      {children}
    </RasterLayerContext.Provider>
  );
}
