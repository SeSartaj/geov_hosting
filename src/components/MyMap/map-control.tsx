import './styles.css';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useControl } from 'react-map-gl/maplibre';
import useMapStore from '@/stores/mapStore';
import { useMap } from 'react-map-gl/maplibre';
import { SettingsContext } from '@/contexts/SettingsContext';
import { BASEMAP_OPTIONS } from '@/constants';

function MapControl() {
  const { current: mapRef } = useMap();
  const [changeMap, setChangeMap] = useState(false);
  const mapInstance = mapRef.getMap();
  const controlRef = useRef(null);
  const viewMode = useMapStore((state) => state.viewMode);
  const { settings, setSettings } = useContext(SettingsContext);

  const basedMap = useMemo(() => {
    return changeMap ? BASEMAP_OPTIONS[1] : BASEMAP_OPTIONS[0];
  }, [changeMap]);

  const onClickMap = useCallback(
    (e) => {
      console.log('click', e.currentTarget?.id);
      setChangeMap((prev) => !prev);
      setSettings({
        ...settings,
        basemap: { ...settings.basemap, id: e.currentTarget?.id },
      });
    },
    [basedMap]
  );

  useControl(
    useCallback(() => {
      const container = document.createElement('div');
      controlRef.current = container;
      container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

      const button = document.createElement('button');
      button.className = 'maplibregl-ctrl-detailview map-view';
      button.type = 'button';
      button.ariaLabel = 'Change view mode';
      button.title = 'Change view mode';
      button.id = basedMap?.id;

      const icon = document.createElement('span');
      icon.className = 'my-ctrl-icon';
      const svgElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      );
      svgElement.setAttribute('width', '24');
      svgElement.setAttribute('height', '24');
      svgElement.setAttribute('fill', 'none');

      const pathElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      pathElement.setAttribute('stroke', '#373737');
      pathElement.setAttribute('strokeLinecap', 'round');
      pathElement.setAttribute('strokeLinejoin', 'round');
      pathElement.setAttribute('strokeWidth', '2');
      pathElement.setAttribute(
        'd',
        'm3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6ZM9 3v15M15 6v15'
      );

      svgElement.appendChild(pathElement);
      icon.innerHTML = svgElement.outerHTML;

      button.appendChild(icon);
      container.appendChild(button);

      // Handle button click
      button.addEventListener('click', onClickMap);

      return {
        onAdd: () => container,
        onRemove: () => container.remove(),
      };
    }, [mapInstance, viewMode, basedMap]),
    { position: 'top-right' }
  );

  // Update button id and onClick function when basedMap changes
  useEffect(() => {
    const buttons = controlRef?.current.getElementsByClassName('map-view');
    if (buttons && buttons.length > 0) {
      const button = buttons[0];
      button.id = basedMap?.id;
    }
  }, [basedMap]);

  return null;
}

export default MapControl;
