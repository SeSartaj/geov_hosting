import React, { useContext, useEffect, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { MapContext } from '@/contexts/MapContext';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import MyModal from '@/ui-components/MyModal';
import NdviChart from '../PlotNDVIChart';
import { TabContent, TabTrigger } from '@/ui-components/Tabs';
import { FaRegMap } from 'react-icons/fa6';
import { HiOutlineMapPin } from 'react-icons/hi2';
import CustomControlButton from '../CustomControl';
import { BiCrosshair } from 'react-icons/bi';

export default function AreaDetails() {
  const { mapInstance } = useContext(MapContext);
  const { clickedData, setClickedData } = useContext(RasterLayerContext);

  if (!clickedData) {
    return null;
  }

  return (
    <>
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
      <CustomControlButton
        label='Toggle Detail View'
        Icon={<BiCrosshair size={24} className='maplibregl-ctrl-icon' />}
        onClick={({ buttonRef }) => {
          setIsDetailActive(!isDetailActive);
          if (buttonRef?.current) {
            console.log(buttonRef.current.classList);
            if (isDetailActive) {
              buttonRef.current.classList.add('active');
            } else {
              buttonRef.current.classList.remove('active');
            }
          }
        }}
      />
    </>
  );
}
