import './styles.css';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useControl } from 'react-map-gl/maplibre';
import useMapStore from '@/stores/mapStore';
import { MapContext } from '@/contexts/MapContext';
import debounce from '@/utils/debounce';
import getPixelValue from '@/utils/getPixelValue';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import { useMap } from 'react-map-gl/maplibre';
import { set } from 'immutable';

function PickerControl() {
  const { current: mapRef } = useMap();
  console.log('mapInstance is', mapRef);
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

  // Store the current opacity
  const rasterOpacity = useMapStore((state) => state.rasterOpacity);
  const setRasterOpacity = useMapStore((state) => state.setRasterOpacity);
  const backToPreviousOpacity = useCallback(() => {
    console.log('back to currentOpacity', rasterOpacity);
    setRasterOpacity(100);
  }, [rasterOpacity, setRasterOpacity]);

  const control = useControl(
    useCallback(() => {
      const container = document.createElement('div');
      controlRef.current = container;
      container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

      const button = document.createElement('button');
      button.className = 'maplibregl-ctrl-detailview';
      button.type = 'button';
      button.ariaLabel = 'Activate picker mode';
      button.title = 'Activate picker mode';

      const icon = document.createElement('span');
      icon.className = 'maplibregl-ctrl-icon';
      icon.ariaHidden = 'true';

      button.appendChild(icon);
      container.appendChild(button);

      // Handle button click
      button.addEventListener('click', () => {
        if (mapInstance) {
          // set layer opacity to one
          if (viewMode === 'PICKER') {
            mapInstance.setPaintProperty('raster-layer', 'raster-opacity', 1);
          } else {
            backToPreviousOpacity();
          }
        }
        toggleNormalPickerMode();
      });

      return {
        onAdd: () => container,
        onRemove: () => container.remove(),
      };
    }, [toggleNormalPickerMode, mapInstance, backToPreviousOpacity, viewMode]),
    { position: 'top-right' }
  );

  // Update button class when viewMode changes
  useEffect(() => {
    const handleClick = (e) => {
      console.log('handling click ');
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
      console.log('setting picker data', data);
      setPickerData(data);
    };

    const button = controlRef?.current.querySelector('button');
    if (viewMode === 'PICKER') {
      button.classList.add('active');
      if (mapInstance) {
        mapInstance.getCanvas().style.cursor = 'crosshair';
        // set opacity to 1
        mapInstance.setPaintProperty('raster-layer', 'raster-opacity', 1);
        mapInstance.on('click', handleClick);
      }
    } else {
      button.classList.remove('active');
      if (mapInstance) {
        mapInstance.getCanvas().style.cursor = '';
        mapInstance.off('click', handleClick);
      }
    }

    return () => {
      if (mapInstance) {
        mapInstance.off('click', handleClick);
        mapInstance.getCanvas().style.cursor = '';
      }
    };
  }, [viewMode, mapInstance, setPickerData]);

  // when ESC is clicked, get out of picker mode
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        backToPreviousOpacity();
        toNormalMode(); // Call your function to switch to normal mode
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toNormalMode, rasterOpacity, mapInstance, backToPreviousOpacity]);

  // track cursor coords
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { lng, lat } = event.lngLat;
      setCursorCords([lng, lat]);
    };
    if (mapInstance && viewMode === 'PICKER') {
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

  return null;
}

export default PickerControl;
