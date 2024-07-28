import { useContext, useEffect, useState } from 'react';
import { MarkersContext } from '../../contexts/markersContext';
import { Marker } from 'react-map-gl/maplibre';
import './styles.css';
import { MapContext } from '../../contexts/MapContext';

export default function Markers() {
  const { mapRef } = useContext(MapContext);
  const { markersData, setClickedMarker } = useContext(MarkersContext);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const zoomThreshold = 5;

  const handleMarkerClick = (e, marker) => {
    console.log('clicked', marker);
    e.originalEvent.stopPropagation();
    setClickedMarker(marker);
  };

  useEffect(() => {
    if (!mapRef?.current) return;

    const updateVisibleMarkers = () => {
      const map = mapRef.current.getMap();
      const bounds = map.getBounds();
      const zoom = map.getZoom();

      if (zoom < zoomThreshold) {
        setVisibleMarkers([]);
        return;
      }

      const filteredMarkers = markersData.filter((marker) => {
        const { longitude, latitude } = marker;
        return (
          bounds.getWest() <= longitude &&
          longitude <= bounds.getEast() &&
          bounds.getSouth() <= latitude &&
          latitude <= bounds.getNorth()
        );
      });

      setVisibleMarkers(filteredMarkers);
    };

    updateVisibleMarkers();

    mapRef.current.on('moveend', updateVisibleMarkers);

    return () => {
      mapRef.current.off('moveend', updateVisibleMarkers);
    };
  }, [mapRef, markersData, zoomThreshold]);

  console.log('rerendering markers ', visibleMarkers.length);

  return visibleMarkers.map((marker) => (
    <Marker
      className='map-marker'
      key={marker.id}
      longitude={marker.longitude}
      latitude={marker.latitude}
      color={marker.color}
      onClick={(e) => handleMarkerClick(e, marker)}
    />
  ));
}
