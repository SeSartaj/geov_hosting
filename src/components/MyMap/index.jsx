import 'maplibre-gl/dist/maplibre-gl.css';
import './mapbox-draw-style.css';

import Map from 'react-map-gl/maplibre';
import { useContext } from 'react';
import { FullscreenControl } from 'react-map-gl/maplibre';

import { MapContext } from '../../contexts/MapContext';
import Sidebar from '../Sidebar';
import Markers from '../Markers';
import MarkerPopup from '../MarkerPopup';
import { SettingsContext, useInitialView } from '../../contexts/SettingsContext';
import PAWStatusPieChart from '../PAWStatusPieChart';
import Plots from '../Plots';
import { DrawPolygonControl } from '../DrawPolygonControl';
import Spinner from '@/ui-components/Spinner';
import StatusBar from '../StatusBar';
import NDVILayer from '../NDVILayer';
import PickerControl from '../PickerControl';
import useMapStore from '@/stores/mapStore';
import ColorLegend from '../ColorLegend';

export default function MyMap() {
  const { mapStyle, mapRef } = useContext(MapContext);
  const initialViewState = useInitialView();
  const viewMode = useMapStore((state) => state.viewMode);


  if (!initialViewState) {
    return <Spinner />;
  }

  // when raster layer is rendered first, the plots layer by default render above it
  // when plots are rendered first, tell the rasterLayer to render beneath it
  // when the raster layer is toggled off and on, it should render beneath the plots layer

  return (
    <Map
      id='myMap'
      ref={mapRef}
      initialViewState={initialViewState}
      style={{ width: '100%', height: '80vh' }}
      mapStyle={typeof mapStyle === 'string' ? mapStyle : mapStyle.toJS()}
      attributionControl={false}
      reuseMaps
      preserveDrawingBuffer={true}
    >
      <FullscreenControl position='top-right' />
      <PickerControl />
      <NDVILayer />
      <Sidebar />
      {viewMode !== 'PICKER' && <DrawPolygonControl />}
      <PAWStatusPieChart />
      <Markers />
      <MarkerPopup />
      <Plots />
      <StatusBar />
      {viewMode === 'PICKER' && <ColorLegend />}
    </Map>
  );
}
