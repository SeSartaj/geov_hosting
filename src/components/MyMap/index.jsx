import Map, { useMap } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useContext } from 'react';
import { MapContext } from '../../contexts/MapContext';

export default function MyMap({ children, props }) {
  const { mapStyle, mapRef } = useContext(MapContext);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: 69.2075,
        latitude: 34.5553,
        zoom: 3,
      }}
      style={{ width: window.innerWidth, height: window.innerHeight }}
      mapStyle={typeof mapStyle === 'string' ? mapStyle : mapStyle.toJS()}
      attributionControl={false}
      reuseMaps
      {...props}
    >
      {children}
    </Map>
  );
}
