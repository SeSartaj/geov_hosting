import { createContext, useState, useEffect } from 'react';
import { parseDate } from '@internationalized/date';

export const RasterLayerContext = createContext(null);

const layerOptions = [
  { value: 'NDVI', label: 'NDVI' },
  { value: 'NDVI-WMTS', label: 'GNDVI' },
  { value: 'EVI2', label: 'EVI2' },
  { value: 'LAI-SAVI', label: 'LAI-SAVI' },
  { value: 'NDVI', label: 'NDVI' },
];

export function RasterLayerProvider({ children }) {
  const [layer, setLayer] = useState(layerOptions[0]);
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(100);
  const [dateRange, setDateRange] = useState({
    start: parseDate('2024-01-01'),
    end: parseDate('2024-12-31'),
  });

  const handleOpacityChange = (e) => {
    setOpacity(e.target.value);
  };

  return (
    <RasterLayerContext.Provider
      value={{
        layer,
        setLayer,
        opacity,
        handleOpacityChange,
        layerOptions,
        dateRange,
        setDateRange,
        isVisible,
        setIsVisible,
      }}
    >
      {children}
    </RasterLayerContext.Provider>
  );
}
