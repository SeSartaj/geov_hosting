import 'maplibre-gl/dist/maplibre-gl.css';
import './mapbox-draw-style.css';

import Map, { Layer, Source } from 'react-map-gl/maplibre';
import { useContext, useEffect, useState } from 'react';
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
import { NDVI_LAYER_URL } from '@/api/sentinalHubApi';
import PlotNdvi from '../PlotNdvi';

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
      // reuseMaps
    >
      <FullscreenControl position='top-right' />
      <Sidebar />
      <PAWStatusPieChart />
      <Markers />
      <MarkerPopup />
      <Plots />
      {/* <PlotNdvi /> */}
      {/* <Source id='ndvi' type='raster' tiles={[NDVI_LAYER_URL]} tileSize={256} />
      <Layer
        id='ndvi-layer'
        type='raster'
        source='ndvi'
        paint={{ 'raster-opacity': 0.6 }}
      /> */}
      {/* <AddNewPlotUI /> */}
      <DrawPolygonControl />
    </Map>
  );
}
