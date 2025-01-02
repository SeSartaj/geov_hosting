import 'maplibre-gl/dist/maplibre-gl.css';
import './mapbox-draw-style.css';

import Map from 'react-map-gl/maplibre';
import { useContext } from 'react';
import { FullscreenControl } from 'react-map-gl/maplibre';

import { MapContext } from '../../contexts/MapContext';
import Sidebar from '../Sidebar';
import Markers from '../Markers';
import MarkerPopup from '../MarkerPopup';
import {
  SettingsContext,
  useInitialView,
} from '../../contexts/SettingsContext';
import PAWStatusPieChart from '../PAWStatusPieChart';
import Plots from '../Plots';
import { DrawPolygonControl } from '../DrawPolygonControl';
import Spinner from '@/ui-components/Spinner';
import StatusBar from '../StatusBar';
import NDVILayer from '../NDVILayer';
import PickerControl from '../PickerControl';
import useMapStore, { VIEW_MODES } from '@/stores/mapStore';
import ColorLegend from '../ColorLegend';
import { AccessTokenProvider } from '@/contexts/AccessTokenProvider';
import MapControl from './map-control';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { FaExclamation } from 'react-icons/fa6';
import { Button } from '../ui/button';
import { EditPlotGeometryControl } from '../EditPlotGeometryControl';
import { AddPlotControl } from '../AddPlotControl';
import { AddStationControl } from '../AddStationControl';

export default function MyMap() {
  const { mapStyle, mapRef } = useContext(MapContext);
  const initialViewState = useInitialView();
  const viewMode = useMapStore((state) => state.viewMode);
  const cursor = useMapStore((state) => state.cursor);

  if (!initialViewState) {
    return <Spinner />;
  }

  // when raster layer is rendered first, the plots layer by default render above it
  // when plots are rendered first, tell the rasterLayer to render beneath it
  // when the raster layer is toggled off and on, it should render beneath the plots layer

  return (
    <SidebarProvider>
      <AccessTokenProvider>
        <Map
          id="myMap"
          ref={mapRef}
          initialViewState={initialViewState}
          style={{ width: '100%', height: '80vh' }}
          mapStyle={typeof mapStyle === 'string' ? mapStyle : mapStyle.toJS()}
          attributionControl={false}
          reuseMaps
          preserveDrawingBuffer={true}
          cursor={cursor}
        >
          <NDVILayer />
          <Sidebar />

          <div className="absolute top-0 left-0"></div>
          <div className="absolute top-0 right-0 m-2" style={{ zIndex: 2 }}>
            <MapControl />
          </div>
          {/* 

          {
            viewMode == VIEW_MODES.ADD_MARKER && 
            <AddMarkerControl />
          }

          {
            viewMode == VIEW_MODES.EDIT_MARKER &&
            <EditMarkerControl />
          } */}

          {/* DrawPolygonControl is a canvas and should always be present. any drawing will be painted on this */}
          <DrawPolygonControl />
          {viewMode == VIEW_MODES.EDIT_PLOT && <EditPlotGeometryControl />}
          {viewMode == VIEW_MODES.ADD_PLOT && <AddPlotControl />}
          {viewMode == VIEW_MODES.ADD_MARKER && <AddStationControl />}

          {/* <PAWStatusPieChart /> */}
          <Markers />
          <MarkerPopup />
          <Plots />
          <StatusBar />
          {viewMode === VIEW_MODES.PICKER && <ColorLegend />}
        </Map>
      </AccessTokenProvider>
    </SidebarProvider>
  );
}
