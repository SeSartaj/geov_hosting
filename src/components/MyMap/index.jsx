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
import useMapStore, { MAP_MODES, VIEW_MODES } from '@/stores/mapStore';
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
import PickerControl from '../PickerControl';
import AvailableDatesCalender from '../AvailableDatesCalender';
import AreaDetails from '../AreaDetails';

export default function MyMap({ style, requestHeaders, configs, markers }) {
  const { settings } = useContext(SettingsContext);

  const { mapRef } = useContext(MapContext);
  const mapRef2 = useRef();
  const initialViewState = useInitialView();
  const [viewState, setViewState] = useState(initialViewState);

  const viewMode = useMapStore((state) => state.viewMode);
  const mapMode = useMapStore((s) => s.mapMode);
  const cursor = useMapStore((state) => state.cursor);
  const setRequestHeaders = useMapStore((state) => state.setRequestHeaders);
  const setConfigs = useMapStore((state) => state.setConfigs);

  const dateRange = useMapStore((state) => state.dateRange);
  const setDateRange = useMapStore((s) => s.setDateRange);

  const dateRange2 = useMapStore((state) => state.dateRange2);
  const setDateRange2 = useMapStore((s) => s.setDateRange2);

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

  // debug
  useEffect(() => {
    console.log('fff dateRange is', dateRange);
    console.log('fff dateRange2 is', dateRange2);
  }, [dateRange, dateRange2]);

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
              <div
                style={{ width: '100%', height: '80vh' }}
                className="flex flex-row"
              >
                <Map
                  id="myMap"
                  ref={mapRef}
                  initialViewState={initialViewState}
                  {...viewState}
                  onMove={onMove}
                  style={{ width: '100%', ...style }}
                  mapStyle={
                    typeof mapStyle === 'string' ? mapStyle : mapStyle.toJS()
                  }
                  attributionControl={false}
                  reuseMaps
                  preserveDrawingBuffer={true}
                  cursor={cursor}
                >
                  <NDVILayer mapRef={mapRef} dateRange={dateRange} />
                  {mapMode == MAP_MODES.NORMAL && <Sidebar mapRef={mapRef} />}

                  <div className="absolute top-0 left-0">
                    {mapMode == MAP_MODES.COMPARISION_VIEW && (
                      <AvailableDatesCalender
                        mapRef={mapRef}
                        setDateRange={setDateRange}
                        compact={true}
                      />
                    )}
                  </div>
                  <div
                    className="absolute top-0 right-0 m-2"
                    style={{ zIndex: 2 }}
                  >
                    {mapMode === MAP_MODES.NORMAL && (
                      <MapControl dateRange={dateRange} mapRef={mapRef} />
                    )}
                    {mapMode !== MAP_MODES.NORMAL && (
                      <PickerControl
                        dateRange={dateRange}
                        mapRef={mapRef}
                        showButton={false}
                      />
                    )}
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
                  <Plots mapRef={mapRef} dateRange={dateRange} />
                  <StatusBar />
                  {viewMode === VIEW_MODES.PICKER &&
                    mapMode !== MAP_MODES.COMPARISION_VIEW && <ColorLegend />}
                </Map>
                {mapMode === MAP_MODES.COMPARISION_VIEW && (
                  <Map
                    id="myMap2"
                    ref={mapRef2}
                    initialViewState={initialViewState}
                    {...viewState}
                    onMove={onMove}
                    style={{ width: '100%', ...style }}
                    mapStyle={
                      typeof mapStyle === 'string' ? mapStyle : mapStyle.toJS()
                    }
                    attributionControl={false}
                    reuseMaps
                    preserveDrawingBuffer={true}
                    cursor={cursor}
                  >
                    <NDVILayer mapRef={mapRef2} dateRange={dateRange2} />

                    <div className="absolute top-0 left-0">
                      <AvailableDatesCalender
                        mapRef={mapRef2}
                        setDateRange={setDateRange2}
                        compact={true}
                      />
                    </div>
                    <div
                      className="absolute top-0 right-0 m-2"
                      style={{ zIndex: 2 }}
                    >
                      <MapControl dateRange={dateRange2} mapRef={mapRef2} />
                    </div>

                    <Plots mapRef={mapRef2} dateRange={dateRange2} />
                    {viewMode === VIEW_MODES.PICKER && <ColorLegend />}
                  </Map>
                )}
                <AreaDetails />
              </div>
            </AccessTokenProvider>
          </SidebarProvider>
        </PlotProvider>
      </RasterLayerProvider>
    </MarkersProvider>
  );
}
