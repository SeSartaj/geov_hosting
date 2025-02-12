import { useContext, useEffect, useState } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import supercluster from 'supercluster';
import { MapContext } from '../../contexts/MapContext';
import { MarkersContext } from '../../contexts/markersContext';
import MyMarker from '../MyMarker';
import { transformMarker } from '@/utils/transformMarker';
import useMapStore from '@/stores/mapStore';

export default function Markers() {
  const { mapRef } = useContext(MapContext);
  const { markersData, showMarkers } = useContext(MarkersContext);

  const setClickedMarker = useMapStore((state) => state.setClickedMarker);

  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [clusters, setClusters] = useState([]);
  const zoomThreshold = 5;
  const transformedMarker = markersData.map((m) => transformMarker(m));

  const formatNumber = (num) =>
    num >= 1_000_000
      ? (num / 1_000_000).toFixed(1) + 'M'
      : num >= 1_000
      ? (num / 1_000).toFixed(1) + 'K'
      : num;

  const handleMarkerClick = (e, marker) => {
    console.log('marker clicked', marker);
    setClickedMarker(marker);
  };

  useEffect(() => {
    if (!mapRef?.current) return;
    if (!showMarkers) return;

    const updateVisibleMarkers = () => {
      const map = mapRef?.current?.getMap();
      if (!map) return;
      const bounds = map.getBounds();
      const zoom = map.getZoom();

      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();

      if (zoom < zoomThreshold) {
        // Create clusters
        const index = new supercluster({
          radius: 40,
          maxZoom: 16,
        });

        index.load(
          transformedMarker.map((marker) => ({
            type: 'Feature',
            properties: { cluster: false, marker },
            geometry: {
              type: 'Point',
              coordinates: [marker.longitude, marker.latitude],
            },
          }))
        );

        const newClusters = index.getClusters(
          [southWest.lng, southWest.lat, northEast.lng, northEast.lat],
          Math.floor(zoom)
        );
        setClusters(newClusters);
        setVisibleMarkers([]); // Hide individual markers
      } else {
        // Show individual markers
        const filteredMarkers = transformedMarker.filter((marker) => {
          const { longitude, latitude } = marker;
          return (
            southWest.lng <= longitude &&
            longitude <= northEast.lng &&
            southWest.lat <= latitude &&
            latitude <= northEast.lat
          );
        });

        setVisibleMarkers(filteredMarkers);
        setClusters([]); // Hide clusters
      }
    };

    updateVisibleMarkers();

    mapRef.current.on('moveend', updateVisibleMarkers);

    return () => {
      mapRef?.current?.off('moveend', updateVisibleMarkers);
    };
  }, [mapRef, markersData, zoomThreshold, showMarkers]);

  if (!showMarkers) return null;

  return (
    <>
      {clusters.length > 0 &&
        clusters.map((cluster) => {
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
                    mapRef.current.getMap().getZoom() + 3,
                    16
                  );
                  mapRef.current.getMap().easeTo({
                    center: [longitude, latitude],
                    zoom: expansionZoom,
                  });
                }}
              >
                <div className="cursor-pointer rounded-full bg-green-700/80 ring-4 ring-green-400 h-[40px] w-[40px] min-w-[40px] flex items-center justify-center text-white text-[14px] px-1 overflow-hidden">
                  {formatNumber(pointCount)}
                </div>
              </Marker>
            );
          }

          // return (
          //   <MyMarker
          //     key={cluster.properties.marker.id}
          //     longitude={longitude}
          //     latitude={latitude}
          //     marker={cluster.properties.marker}
          //     onClick={(e) => handleMarkerClick(e, cluster.properties.marker)}
          //   />
          // );
        })}

      {visibleMarkers.length > 0 &&
        visibleMarkers.map((marker) => {
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
