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

  const satelliteIcon = useMemo(() => {
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
    pathElement.setAttribute('stroke', 'currentColor');
    pathElement.setAttribute('strokeLinecap', 'round');
    pathElement.setAttribute('strokeLinejoin', 'round');
    pathElement.setAttribute('strokeWidth', '2');
    pathElement.setAttribute(
      'd',
      'm3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6ZM9 3v15M15 6v15'
    );

    svgElement.appendChild(pathElement);
    icon.innerHTML = svgElement.outerHTML;
    return icon;
  }, []);

  const basicIcon = useMemo(() => {
    const icon = document.createElement('span');
    icon.className = 'my-ctrl-icon';
    const svgElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('height', '24px');
    svgElement.setAttribute('viewBox', '0 -960 960 960');
    svgElement.setAttribute('width', '24px');
    svgElement.setAttribute('fill', 'currentColor');

    const pathElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    pathElement.setAttribute(
      'd',
      'M560-32v-80q117 0 198.5-81.5T840-392h80q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T560-32Zm0-160v-80q50 0 85-35t35-85h80q0 83-58.5 141.5T560-192ZM222-57q-15 0-30-6t-27-17L23-222q-11-12-17-27t-6-30q0-16 6-30.5T23-335l127-127q23-23 57-23.5t57 22.5l50 50 28-28-50-50q-23-23-23-56t23-56l57-57q23-23 56.5-23t56.5 23l50 50 28-28-50-50q-23-23-23-56.5t23-56.5l127-127q12-12 27-18t30-6q15 0 29.5 6t26.5 18l142 142q12 11 17.5 25.5T895-730q0 15-5.5 30T872-673L745-546q-23 23-56.5 23T632-546l-50-50-28 28 50 50q23 23 22.5 56.5T603-405l-56 56q-23 23-56.5 23T434-349l-50-50-28 28 50 50q23 23 22.5 57T405-207L278-80q-11 11-25.5 17T222-57Zm0-79 42-42-142-142-42 42 142 142Zm85-85 42-42-142-142-42 42 142 142Zm184-184 56-56-142-142-56 56 142 142Zm198-198 42-42-142-142-42 42 142 142Zm85-85 42-42-142-142-42 42 142 142ZM448-504Z'
    );
    svgElement.appendChild(pathElement);
    icon.innerHTML = svgElement.outerHTML;
    return icon;
  }, []);

  const onClickMap = useCallback(
    (e) => {
      const maptile = e.currentTarget?.id;
      console.log('click', maptile);
      setChangeMap((prev) => !prev);
      setSettings({
        ...settings,
        basemap: {
          ...settings.basemap,
          id: maptile === 'basic' ? 'satellite' : 'basic',
        },
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
      button.className = 'maplibregl-ctrl-detailview map-view dark';
      button.type = 'button';
      button.ariaLabel = 'Change view mode';
      button.title = 'Change view mode';
      button.id = basedMap?.id;

      const icon = basedMap?.id === 'basic' ? satelliteIcon : basicIcon;

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
      // update icon
      const icon = basedMap?.id === 'basic' ? basicIcon : satelliteIcon;
      button.innerHTML = icon.outerHTML;
    }
  }, [basedMap]);

  return null;
}

export default MapControl;
