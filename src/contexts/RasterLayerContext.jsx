import { createContext, useState, useEffect } from 'react';

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
  const [opacity, setOpacity] = useState(100);

  const handleOpacityChange = (e) => {
    setOpacity(e.target.value);
  };

  return (
    <RasterLayerContext.Provider
      value={{ layer, setLayer, opacity, handleOpacityChange, layerOptions }}
    >
      {children}
    </RasterLayerContext.Provider>
  );
}
