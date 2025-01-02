import './styles.css';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useControl } from 'react-map-gl/maplibre';
import useMapStore, { VIEW_MODES } from '@/stores/mapStore';
import { MapContext } from '@/contexts/MapContext';
import debounce from '@/utils/debounce';
import getPixelValue from '@/utils/getPixelValue';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import { useMap } from 'react-map-gl/maplibre';
import { set } from 'immutable';
import { Button } from '../ui/button';
import { Pipette } from 'lucide-react';

function PickerControl() {
  const { current: mapRef } = useMap();
  const mapInstance = mapRef.getMap();
  const controlRef = useRef(null);
  const viewMode = useMapStore((state) => state.viewMode);
  const toggleNormalPickerMode = useMapStore(
    (state) => state.toggleNormalPickerMode
  );
  const toNormalMode = useMapStore((state) => state.toNormalMode);
  const setPickerData = useMapStore((state) => state.setPickerData);
  const setCursorCords = useMapStore((state) => state.setCursorCords);
  const setHoveredValue = useMapStore((state) => state.setHoveredValue);
  const rasterLayer = useMapStore((state) => state.rasterLayer);
  const setCursor = useMapStore((state) => state.setCursor);
  const resetCursor = useMapStore((state) => state.resetCursor);

  // Store the current opacity
  const rasterOpacity = useMapStore((state) => state.rasterOpacity);
  const setRasterOpacity = useMapStore((state) => state.setRasterOpacity);
  const backToPreviousOpacity = useCallback(() => {
    console.log('back to currentOpacity', rasterOpacity);
    setRasterOpacity(100);
  }, [rasterOpacity, setRasterOpacity]);

  const handleClick = (e) => {
    if (mapInstance) {
      // set layer opacity to one
      if (viewMode === 'PICKER') {
        mapInstance.setPaintProperty('raster-layer', 'raster-opacity', 1);
      } else {
        backToPreviousOpacity();
      }
    }
    toggleNormalPickerMode();
  };

  // when ESC is clicked, get out of picker mode
  useEffect(() => {
    const handleKeyDown = (event) => {
      // if in picker mode and clicked escape
      if (event.key === 'Escape') {
        backToPreviousOpacity();
        toNormalMode(); // Call your function to switch to normal mode
      }
    };

    if (viewMode === 'PICKER') {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    toNormalMode,
    rasterOpacity,
    mapInstance,
    backToPreviousOpacity,
    viewMode,
  ]);

  // track cursor coords
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { lng, lat } = event.lngLat;
      setCursorCords([lng, lat]);
    };
    // if (mapInstance && viewMode === 'PICKER') {
    if (mapInstance) {
      mapInstance.on('mousemove', handleMouseMove);
    }
    // Cleanup the event listener when the component unmounts
    return () => {
      if (mapInstance) {
        mapInstance.off('mousemove', handleMouseMove);
      }
    };
  }, [mapInstance, setCursorCords, viewMode]);

  // Get pixel color under the cursor when in picker mode
  useEffect(() => {
    const handlePixelValue = (event) => {
      const canvas = mapInstance.getCanvas();
      const gl = mapInstance.painter.context.gl;

      if (!gl) {
        console.error('WebGL context is not available.');
        return;
      }
      // store RGBA values
      const pixel = new Uint8Array(4);

      // Adjust for device pixel ratio (DPR)
      const dpr = window.devicePixelRatio || 1;
      // Convert screen position to pixel position, considering DPR and flipping Y-axis
      const x = Math.floor(event.point.x * dpr);
      const y = Math.floor(canvas.height - event.point.y * dpr);

      // Ensure coordinates are within bounds
      if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
        console.warn('Mouse is outside the canvas bounds');
        return;
      }

      // Read the pixel data from the WebGL context
      gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

      const value = getPixelValue(rasterLayer?.value, pixel);

      // Return or use the NDVI value
      setHoveredValue(value);
    };

    const debouncedGetPixelValue = debounce(handlePixelValue, 100);

    // Add event listener if mapInstance exists, the viewMode is PICKER, and the map has loaded
    if (mapInstance && viewMode === 'PICKER' && mapInstance?.loaded) {
      console.log('Adding pixel event listener');
      mapInstance.on('mousemove', debouncedGetPixelValue);
    }

    // Clean up the event listener on unmount or if dependencies change
    return () => {
      if (mapInstance) {
        mapInstance.off('mousemove', debouncedGetPixelValue);
      }
    };
  }, [mapInstance, viewMode, setHoveredValue, rasterLayer]);

  // turn of move and zoom
  useEffect(() => {
    if (mapInstance) {
      if (viewMode === 'PICKER') {
        mapInstance.scrollZoom.disable();
        mapInstance.boxZoom.disable();
        mapInstance.dragPan.disable();
        mapInstance.dragRotate.disable();
      } else {
        mapInstance.scrollZoom.enable();
        mapInstance.boxZoom.enable();
        mapInstance.dragPan.enable();
        mapInstance.dragRotate.enable();
      }
    }
  }, [viewMode, mapInstance]);

  // change cursor to crosshair when in picker mode
  useEffect(() => {
    if (viewMode === 'PICKER') {
      setCursor('crosshair');
    } else {
      resetCursor();
    }
  }, [viewMode]);

  return (
    <Button
      variant="outline"
      size="icon"
      title="Activate picker mode"
      ariaLabel="Activate picker mode"
      onClick={handleClick}
      className={` ${
        viewMode === VIEW_MODES.PICKER ? ' bg-gray-200 dark:bg-gray-600' : ''
      }`}
    >
      <Pipette />
    </Button>
  );
}

export default PickerControl;
