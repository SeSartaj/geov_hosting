import 'maplibre-gl/dist/maplibre-gl.css';
import './mapbox-draw-style.css';

import Map from 'react-map-gl/maplibre';
import { useContext } from 'react';
import { FullscreenControl } from 'react-map-gl/maplibre';

import { MapContext } from '../../contexts/MapContext';
import Sidebar from '../Sidebar';
import Markers from '../Markers';
import MarkerPopup from '../MarkerPopup';
import { SettingsContext } from '../../contexts/SettingsContext';
import PAWStatusPieChart from '../PAWStatusPieChart';
import Plots from '../Plots';
import { DrawPolygonControl } from '../DrawPolygonControl';
import Spinner from '@/ui-components/Spinner';
import StatusBar from '../StatusBar';
import NDVILayer from '../NDVILayer';

export default function MyMap() {
  const { mapStyle, mapRef } = useContext(MapContext);
  const { initialViewState } = useContext(SettingsContext);

  if (!initialViewState) {
    return <Spinner />;
  }

  return (
    <Map
      ref={mapRef}
      initialViewState={initialViewState}
      style={{ width: '100%', height: '80vh' }}
      mapStyle={typeof mapStyle === 'string' ? mapStyle : mapStyle.toJS()}
      attributionControl={false}
      reuseMaps
    >
      <FullscreenControl position='top-right' />
      <Sidebar />
      <PAWStatusPieChart />
      <Markers />
      <MarkerPopup />
      <Plots />
      <DrawPolygonControl />
      <StatusBar />
      <NDVILayer />
    </Map>
  );
}
