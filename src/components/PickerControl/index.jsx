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
  const setPickerData = useMapStore((state) => state.setPickerData);

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

  return null;
}

export default PickerControl;
