import { createContext, useState, useEffect, useContext } from 'react';
import { MapContext } from './MapContext';
import { layerOptions } from '@/constants';

export const RasterLayerContext = createContext(null);

export function RasterLayerProvider({ children }) {
  const [layer, setLayer] = useState(layerOptions[0]);
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [isDetailActive, setIsDetailActive] = useState(false);
  const [datesLoading, setDatesLoading] = useState(false);

  const handleOpacityChange = (e) => {
    setOpacity(e.target.value);
  };

  return (
    <RasterLayerContext.Provider
      value={{
        layer,
        setLayer,
        opacity,
        setOpacity,
        handleOpacityChange,
        layerOptions,
        isVisible,
        setIsVisible,
        isDetailActive,
        datesLoading,
        setDatesLoading,
      }}
    >
      {children}
    </RasterLayerContext.Provider>
  );
}
