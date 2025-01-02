import './styles.css';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useControl } from 'react-map-gl/maplibre';
import useMapStore, { VIEW_MODES } from '@/stores/mapStore';
import { useMap } from 'react-map-gl/maplibre';
import { SettingsContext } from '@/contexts/SettingsContext';
import { BASEMAP_OPTIONS } from '@/constants';
import { Button } from '../ui/button';
import { FaExclamation, FaSatellite, FaSatelliteDish } from 'react-icons/fa6';
import {
  ChevronRight,
  Hexagon,
  LandPlot,
  MapIcon,
  Maximize,
  Minimize,
  Pin,
  Satellite,
  SatelliteDish,
  SatelliteDishIcon,
} from 'lucide-react';
import PickerControl from '../PickerControl';

function SatelliteIcon() {
  return (
    <span className="my-ctrl-icon">
      <svg
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6ZM9 3v15M15 6v15"
        />
      </svg>
    </span>
  );
}

function BasicIcon() {
  return (
    <span className="my-ctrl-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path d="M560-32v-80q117 0 198.5-81.5T840-392h80q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T560-32Zm0-160v-80q50 0 85-35t35-85h80q0 83-58.5 141.5T560-192ZM222-57q-15 0-30-6t-27-17L23-222q-11-12-17-27t-6-30q0-16 6-30.5T23-335l127-127q23-23 57-23.5t57 22.5l50 50 28-28-50-50q-23-23-23-56t23-56l57-57q23-23 56.5-23t56.5 23l50 50 28-28-50-50q-23-23-23-56.5t23-56.5l127-127q12-12 27-18t30-6q15 0 29.5 6t26.5 18l142 142q12 11 17.5 25.5T895-730q0 15-5.5 30T872-673L745-546q-23 23-56.5 23T632-546l-50-50-28 28 50 50q23 23 22.5 56.5T603-405l-56 56q-23 23-56.5 23T434-349l-50-50-28 28 50 50q23 23 22.5 57T405-207L278-80q-11 11-25.5 17T222-57Zm0-79 42-42-142-142-42 42 142 142Zm85-85 42-42-142-142-42 42 142 142Zm184-184 56-56-142-142-56 56 142 142Zm198-198 42-42-142-142-42 42 142 142Zm85-85 42-42-142-142-42 42 142 142ZM448-504Z" />
      </svg>
    </span>
  );
}

function MapControl() {
  const { current: mapInstance } = useMap();
  const [changeMap, setChangeMap] = useState(false);
  const controlRef = useRef(null);
  const { settings, setSettings } = useContext(SettingsContext);
  const [isFullScreen, setisFullScreen] = useState(false);
  const setViewMode = useMapStore((state) => state.setViewMode);

  const handleMapStyleChange = useCallback(() => {
    setChangeMap((prev) => !prev);
    setSettings((prevSettings) => ({
      ...prevSettings,
      basemap: {
        ...prevSettings.basemap,
        id: prevSettings.basemap.id === 'basic' ? 'satellite' : 'basic',
      },
    }));
  }, [setSettings]);

  const handleFullScreen = useCallback(() => {
    if (!mapInstance) return;

    const mapContainer = mapInstance.getContainer();
    console.log('mapContainer', mapContainer);

    if (document.fullscreenElement) {
      // Exit fullscreen
      document.exitFullscreen();
      setisFullScreen(false);
    } else {
      // Enter fullscreen
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen();
      } else if (mapContainer.mozRequestFullScreen) {
        mapContainer.mozRequestFullScreen(); // For Firefox
      } else if (mapContainer.webkitRequestFullscreen) {
        mapContainer.webkitRequestFullscreen(); // For Safari
      } else if (mapContainer.msRequestFullscreen) {
        mapContainer.msRequestFullscreen(); // For Internet Explorer
      }
    }
    setisFullScreen(true);
  }, [mapInstance]);

  return (
    <>
      <div className=" gap-1 flex flex-col">
        {mapInstance && (
          <Button
            variant="outline"
            size="icon"
            aria-label="Change view mode"
            title="Change view mode"
            onClick={handleMapStyleChange}
          >
            {settings.basemap.id === 'basic' ? <SatelliteDish /> : <MapIcon />}
          </Button>
        )}
        <Button variant="outline" size="icon" onClick={handleFullScreen}>
          {isFullScreen ? <Minimize /> : <Maximize />}
        </Button>
        <PickerControl />
        <Button
          variant="outline"
          size="icon"
          title="add new plot"
          onClick={() => setViewMode(VIEW_MODES.ADD_PLOT)}
        >
          <Hexagon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          title="add new station"
          onClick={() => setViewMode(VIEW_MODES.ADD_MARKER)}
        >
          <Pin />
        </Button>
      </div>
    </>
  );
}

export default MapControl;
