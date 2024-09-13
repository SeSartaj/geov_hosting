import React, { useContext, useEffect, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { MapContext } from '@/contexts/MapContext';
import MyModal from '@/ui-components/MyModal';
import NdviChart from '../PlotNDVIChart';
import { TabContent, TabTrigger } from '@/ui-components/Tabs';
import { FaRegMap } from 'react-icons/fa6';
import { HiOutlineMapPin } from 'react-icons/hi2';
import useMapStore from '@/stores/mapStore';

export default function AreaDetails() {
  const { mapRef } = useContext(MapContext);
  const pickerData = useMapStore((state) => state.pickerData);
  const setPickerData = useMapStore((state) => state.setPickerData);

  if (!pickerData) {
    return null;
  }

  console.log('picker data', pickerData);

  return (
    <>
      <MyModal open={true} setOpen={() => setPickerData(null)}>
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
            {pickerData?.plot && (
              <TabTrigger value='plot' tooltipText='Plot'>
                <FaRegMap className='cursor-pointer' />
              </TabTrigger>
            )}
          </Tabs.List>
          <br />
          <TabContent value='point'>
            <NdviChart point={pickerData.coordinates} />
          </TabContent>
          {pickerData?.plot && (
            <TabContent value='plot'>
              <NdviChart plot={pickerData.plot} />
            </TabContent>
          )}
        </Tabs.Root>
      </MyModal>
    </>
  );
}
