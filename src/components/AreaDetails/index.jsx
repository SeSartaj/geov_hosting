import React, { useContext, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { MapContext } from '@/contexts/MapContext';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import MyModal from '@/ui-components/MyModal';
import NdviChart from '../PlotNDVIChart';
import { TabContent, TabTrigger } from '@/ui-components/Tabs';
import { FaRegMap } from 'react-icons/fa6';
import { HiOutlineMapPin } from 'react-icons/hi2';

export default function AreaDetails() {
  const { mapInstance } = useContext(MapContext);
  const { clickedData, setClickedData } = useContext(RasterLayerContext);

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
    <MyModal open={true} setOpen={() => setClickedData(null)}>
      <Tabs.Root
        className='flex flex-col w-full h-full overflow-y-hidden'
        defaultValue='point'
      >
        <Tabs.List
          className='flex flex-shrink-0 justify-start '
          aria-label='Manage your account'
        >
          <TabTrigger
            value='point'
            tooltipText='Point'
            portalContainer={mapInstance.getContainer()}
          >
            <HiOutlineMapPin className='cursor-pointer' />
          </TabTrigger>
          {clickedData?.plot && (
            <TabTrigger value='plot' tooltipText='Plot'>
              <FaRegMap className='cursor-pointer' />
            </TabTrigger>
          )}
        </Tabs.List>
        <TabContent value='point'>
          <NdviChart point={clickedData.coordinates} />
        </TabContent>
        {clickedData?.plot && (
          <TabContent value='plot'>
            <NdviChart plot={clickedData.plot} />
          </TabContent>
        )}
      </Tabs.Root>
    </MyModal>
  );
}
