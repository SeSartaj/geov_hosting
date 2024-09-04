import './styles.css';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { useControl } from 'react-map-gl';
import useMapStore from '@/stores/mapStore';
import { MapContext } from '@/contexts/MapContext';

function PickerControl() {
  const controlRef = useRef(null);
  const { mapInstance } = useContext(MapContext);
  const viewMode = useMapStore((state) => state.viewMode);
  const toggleNormalPickerMode = useMapStore(
    (state) => state.toggleNormalPickerMode
  );
  const toNormalMode = useMapStore((state) => state.toNormalMode);
  const setPickerData = useMapStore((state) => state.setPickerData);
  const setCursorCords = useMapStore((state) => state.setCursorCords);

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
        toggleNormalPickerMode();
      });
      // if viewMode is "PICKER" and esc button is clicked on keyboard
      // i want to toggle to normal mode

      return {
        onAdd: () => container,
        onRemove: () => container.remove(),
      };
    }, [toggleNormalPickerMode]),
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
        toNormalMode(); // Call your function to switch to normal mode
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toNormalMode]);

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

  return null;
}

export default PickerControl;
