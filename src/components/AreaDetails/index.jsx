import React, { useContext, useEffect } from 'react';
import { MapContext } from '@/contexts/MapContext';
import { useMap } from 'react-map-gl/maplibre';

export default function AreaDetails() {
  const { mapInstance } = useContext(MapContext);

  console.log('AreaDetails');

  useEffect(() => {
    console.log('before map check');

    const handleClick = (e) => {
      console.log('Clicked on map:', e);
      // first check if plots-layer exist
      if (mapInstance.getLayer('plots-layer')) {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: ['plots-layer'], // Replace with your actual layer ID
        });
        if (features.length > 0) {
          // Clicked on a plot
          const plot = features[0];
          const coordinates = e.lngLat;
          console.log('Coordinates:', coordinates);
          console.log('Plot Details:', plot.properties); // Replace with actual plot details
        }
      } else {
        // Clicked outside of plots
        const coordinates = e.lngLat;
        console.log('Coordinates:', coordinates);
      }
    };
    console.log('inside useEffect', mapInstance);
    if (mapInstance) {
      console.log('adding event to map');
      mapInstance.on('click', handleClick);
    }

    // Clean up the event listener on component unmount
    return () => {
      if (mapInstance) {
        mapInstance.off('click', handleClick);
      }
    };
  }, [mapInstance]);

  return null;
}
