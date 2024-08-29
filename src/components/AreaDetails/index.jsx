import React, { useContext, useEffect } from 'react';
import { MapContext } from '@/contexts/MapContext';
import { useMap } from 'react-map-gl/maplibre';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import MyModal from '@/ui-components/MyModal';

export default function AreaDetails() {
  const { mapInstance } = useContext(MapContext);
  const { clickedData, setClickedData } = useContext(RasterLayerContext);

  console.log('AreaDetails');

  useEffect(() => {
    console.log('before map check');

    const handleClick = (e) => {
      console.log('Clicked on map:', e);
      let data = {
        coordinates: e.lngLat,
      };

      // clicked inside a plot
      if (mapInstance.getLayer('plots-layer')) {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: ['plots-layer'], // Replace with your actual layer ID
        });
        if (features.length > 0) {
          data.plot = features[0];
        }
      }
      console.log('clickedData:', data);
      setClickedData(data);
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

  if (!clickedData) {
    return null;
  }

  return (
    <MyModal
      title={
        clickedData?.plot
          ? `${clickedData.plot.properties.name} `
          : `${clickedData?.coordinates}`
      }
      description='description'
      open={true}
      setOpen={() => setClickedData(null)}
    ></MyModal>
  );
}
