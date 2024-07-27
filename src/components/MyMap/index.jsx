import 'maplibre-gl/dist/maplibre-gl.css';

import Map from 'react-map-gl/maplibre';
import { useContext } from 'react';
import { FullscreenControl } from 'react-map-gl/maplibre';

import { MapContext } from '../../contexts/MapContext';
import Sidebar from '../Sidebar';
import Markers from '../Markers';
import MarkerPopup from '../MarkerPopup';

export default function MyMap() {
  const { mapStyle, mapRef } = useContext(MapContext);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: 69.2075,
        latitude: 34.5553,
        width: '100%',
        height: '100%',
        zoom: 3,
      }}
      style={{ width: '100%', height: '80vh' }}
      mapStyle={typeof mapStyle === 'string' ? mapStyle : mapStyle.toJS()}
      attributionControl={false}
      reuseMaps
    >
      <FullscreenControl position='top-right' />
      <Sidebar />
      <Markers />
      <MarkerPopup />
    </Map>
  );
}
