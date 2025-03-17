import 'maplibre-gl/dist/maplibre-gl.css';
import './mapbox-draw-style.css';

import Map from 'react-map-gl/maplibre';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
import useMapStore, { VIEW_MODES } from '@/stores/mapStore';
import ColorLegend from '../ColorLegend';
import { AccessTokenProvider } from '@/contexts/AccessTokenProvider';
import MapControl from './map-control';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { EditPlotGeometryControl } from '../EditPlotGeometryControl';
import { AddPlotControl } from '../AddPlotControl';
import { AddStationControl } from '../AddStationControl';
import AddPlotModal from '../AddPlotModal';
import AddFarmModal from '../AddFarmModal';
import { RasterLayerProvider } from '@/contexts/RasterLayerContext';
import { PlotProvider } from '@/contexts/PlotContext';
import { MarkersProvider } from '@/contexts/markersContext';
import { BASEMAP_OPTIONS } from '@/constants';

export default function MyMap({ style, requestHeaders, configs, markers }) {
  const { settings } = useContext(SettingsContext);

  const { mapRef } = useContext(MapContext);
  const mapRef2 = useRef();
  const initialViewState = useInitialView();
  const [viewState, setViewState] = useState(initialViewState);

  const viewMode = useMapStore((state) => state.viewMode);
  const cursor = useMapStore((state) => state.cursor);
  const setRequestHeaders = useMapStore((state) => state.setRequestHeaders);
  const setConfigs = useMapStore((state) => state.setConfigs);

  const onMove = useCallback((evt) => setViewState(evt.viewState), []);

  const [mapStyle, setMapStyle] = useState(
    `${BASEMAP_OPTIONS.find((o) => o.id === settings.basemap.id)?.url}?key=${
      configs?.VITE_MAPTILER_ACCESS_KEY
    }`
  );

  // whenever settings changes--like new user login-- update the mapstyle
  useEffect(() => {
    setMapStyle(
      `${BASEMAP_OPTIONS.find((o) => o.id === settings.basemap.id)?.url}?key=${
        configs?.VITE_MAPTILER_ACCESS_KEY
      }`
    );
  }, [settings]);

  useEffect(() => {
    setRequestHeaders(requestHeaders);
  }, [requestHeaders]);

  useEffect(() => {
    setConfigs(configs);
  }, []);

  if (!initialViewState) {
    return <Spinner />;
  }

  // when raster layer is rendered first, the plots layer by default render above it
  // when plots are rendered first, tell the rasterLayer to render beneath it
  // when the raster layer is toggled off and on, it should render beneath the plots layer

  return (
    <MarkersProvider providedMarkers={markers}>
      <RasterLayerProvider>
        <PlotProvider>
          <SidebarProvider>
            <AccessTokenProvider>
              <Map
                id="myMap"
                ref={mapRef}
                initialViewState={initialViewState}
                {...viewState}
                onMove={onMove}
                style={{ width: '100%', height: '80vh', ...style }}
                mapStyle={
                  typeof mapStyle === 'string' ? mapStyle : mapStyle.toJS()
                }
                attributionControl={false}
                reuseMaps
                preserveDrawingBuffer={true}
                cursor={cursor}
              >
                <NDVILayer mapRef={mapRef} />
                <Sidebar />

                <div className="absolute top-0 left-0"></div>
                <div
                  className="absolute top-0 right-0 m-2"
                  style={{ zIndex: 2 }}
                >
                  {/* <MapControl /> */}
                </div>
                {/* 



          {/* DrawPolygonControl is a canvas and should always be present. any drawing will be painted on this */}
                <DrawPolygonControl />
                {viewMode == VIEW_MODES.EDIT_PLOT && (
                  <EditPlotGeometryControl />
                )}
                {viewMode == VIEW_MODES.ADD_PLOT && <AddPlotControl />}
                {viewMode == VIEW_MODES.ADD_MARKER && <AddStationControl />}
                {viewMode == VIEW_MODES.ADD_NEW_FARM && <AddFarmModal />}

                <PAWStatusPieChart />
                <Markers />
                <MarkerPopup />
                <Plots mapRef={mapRef} />
                <StatusBar />
                {/* {viewMode === VIEW_MODES.PICKER && <ColorLegend />} */}
              </Map>
              <Map
                id="myMap2"
                ref={mapRef2}
                initialViewState={initialViewState}
                {...viewState}
                onMove={onMove}
                style={{ width: '100%', height: '80vh', ...style }}
                mapStyle={
                  typeof mapStyle === 'string' ? mapStyle : mapStyle.toJS()
                }
                attributionControl={false}
                reuseMaps
                preserveDrawingBuffer={true}
                cursor={cursor}
              >
                <NDVILayer mapRef={mapRef2} />

                <div className="absolute top-0 left-0"></div>
                <div
                  className="absolute top-0 right-0 m-2"
                  style={{ zIndex: 2 }}
                >
                  <MapControl />
                </div>

                <Plots mapRef={mapRef2} />
                {viewMode === VIEW_MODES.PICKER && <ColorLegend />}
              </Map>
            </AccessTokenProvider>
          </SidebarProvider>
        </PlotProvider>
      </RasterLayerProvider>
    </MarkersProvider>
  );
}
