import { useContext, useEffect, useState, useRef } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import supercluster from 'supercluster';
import './styles.css';
import { MapContext } from '../../contexts/MapContext';
import { MarkersContext } from '../../contexts/markersContext';
import MyMarker from '../MyMarker';

export default function Markers() {
  const { mapRef } = useContext(MapContext);
  const { markersData, setClickedMarker } = useContext(MarkersContext);
  const [clusters, setClusters] = useState([]);
  const [visbileMarkers, setVisibleMarkers] = useState([]);

  console.log('markersData', markersData);

  const zoomThreshold = 5;

  const handleMarkerClick = (e, marker) => {
    console.log('clicked', marker);
    e.originalEvent.stopPropagation();
    setClickedMarker(marker);
  };

  // useEffect(() => {
  //   if (!mapRef?.current) return;

  //   const updateClusters = () => {
  //     if (!mapRef?.current) return;
  //     const map = mapRef.current.getMap();
  //     const bounds = map.getBounds().toArray().flat();
  //     const zoom = map.getZoom();

  //     // if (zoom < zoomThreshold) {
  //     //   setClusters([]);
  //     //   return;
  //     // }

  //     const index = new supercluster({
  //       radius: 40,
  //       maxZoom: 16,
  //     });

  //     index.load(
  //       markersData.map((marker) => ({
  //         type: 'Feature',
  //         properties: { cluster: false, marker },
  //         geometry: {
  //           type: 'Point',
  //           coordinates: [marker.location.lng, marker.location.lat],
  //         },
  //       }))
  //     );

  //     const newClusters = index.getClusters(bounds, Math.floor(zoom));
  //     setClusters(newClusters);
  //   };

  //   updateClusters();

  //   mapRef.current.on('moveend', updateClusters);

  //   return () => {
  //     mapRef?.current?.off('moveend', updateClusters);
  //   };
  // }, [mapRef, markersData, zoomThreshold]);

  useEffect(() => {
    if (!mapRef?.current) return;

    const updateVisibleMarkers = () => {
      const map = mapRef?.current?.getMap();
      if (!map) return;
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
      console.log('filtered markers', filteredMarkers);

      setVisibleMarkers(filteredMarkers);
    };

    updateVisibleMarkers();

    mapRef.current.on('moveend', updateVisibleMarkers);

    return () => {
      mapRef.current.off('moveend', updateVisibleMarkers);
    };
  }, [mapRef, markersData, zoomThreshold]);

  console.log('rerendering clusters ', clusters.length);

  return (
    <>
      {visbileMarkers.map((marker) => {
        return (
          <MyMarker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            marker={marker}
            onClick={(e) => handleMarkerClick(e, marker)}
          />
        );
      })}
    </>
  );
}
