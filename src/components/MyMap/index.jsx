import 'maplibre-gl/dist/maplibre-gl.css';
import './mapbox-draw-style.css';

import Map from 'react-map-gl/maplibre';
import { useContext, useState } from 'react';
import { FullscreenControl } from 'react-map-gl/maplibre';

import { MapContext } from '../../contexts/MapContext';
import Sidebar from '../Sidebar';
import Markers from '../Markers';
import MarkerPopup from '../MarkerPopup';
import { SettingsContext } from '../../contexts/SettingsContext';
import PAWStatusPieChart from '../PAWStatusPieChart';
import Plots from '../Plots';
// import AddNewPlotUI from '../AddNewPlotUI/AddNewPlotUI';
import { DrawPolygonControl } from '../DrawPolygonControl';

export default function MyMap() {
  const { mapStyle, mapRef } = useContext(MapContext);
  const { settings } = useContext(SettingsContext);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        latitude: settings.basemap.latitude,
        longitude: settings.basemap.longitude,
        width: '100%',
        height: '100%',
        zoom: settings.basemap.zoom,
      }}
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
      {/* <AddNewPlotUI /> */}
      <DrawPolygonControl />
    </Map>
  );
}
