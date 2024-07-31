import { useContext, useEffect, useState, useRef } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import supercluster from 'supercluster';
import './styles.css';
import { MapContext } from '../../contexts/MapContext';
import { MarkersContext } from '../../contexts/markersContext';

export default function Markers() {
  const { mapRef } = useContext(MapContext);
  const { markersData, setClickedMarker } = useContext(MarkersContext);
  const [clusters, setClusters] = useState([]);
  const zoomThreshold = 5;
  const clusterRef = useRef(null);

  const handleMarkerClick = (e, marker) => {
    console.log('clicked', marker);
    e.originalEvent.stopPropagation();
    setClickedMarker(marker);
  };

  useEffect(() => {
    if (!mapRef?.current) return;

    const updateClusters = () => {
      if (!mapRef?.current) return;
      const map = mapRef.current.getMap();
      const bounds = map.getBounds().toArray().flat();
      const zoom = map.getZoom();

      // if (zoom < zoomThreshold) {
      //   setClusters([]);
      //   return;
      // }

      const index = new supercluster({
        radius: 40,
        maxZoom: 16,
      });

      index.load(
        markersData.map((marker) => ({
          type: 'Feature',
          properties: { cluster: false, marker },
          geometry: {
            type: 'Point',
            coordinates: [marker.longitude, marker.latitude],
          },
        }))
      );

      const newClusters = index.getClusters(bounds, Math.floor(zoom));
      setClusters(newClusters);
    };

    updateClusters();

    mapRef.current.on('moveend', updateClusters);

    return () => {
      mapRef?.current?.off('moveend', updateClusters);
    };
  }, [mapRef, markersData, zoomThreshold]);

  console.log('rerendering clusters ', clusters.length);

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              longitude={longitude}
              latitude={latitude}
              onClick={() => {
                const expansionZoom = Math.min(
                  mapRef.current.getMap().getZoom() + 2,
                  16
                );
                mapRef.current.getMap().easeTo({
                  center: [longitude, latitude],
                  zoom: expansionZoom,
                });
              }}
              className='cluster-marker'
            >
              <div className='cluster-marker-inner'>{pointCount}</div>
            </Marker>
          );
        }

        return (
          <Marker
            className='map-marker'
            key={cluster.properties.marker.id}
            longitude={longitude}
            latitude={latitude}
            color={cluster.properties.marker.color}
            onClick={(e) => handleMarkerClick(e, cluster.properties.marker)}
          />
        );
      })}
    </>
  );
}
