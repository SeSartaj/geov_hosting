import React, { useContext, useEffect, useState } from 'react';
// import * as Tabs from '@radix-ui/react-tabs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  return (
    <>
      <MyModal
        open={true}
        setOpen={() => setPickerData(null)}
        title="Area Details"
        headerClassName="m-4"
      >
        <Tabs
          className="flex flex-col w-full h-full overflow-y-hidden"
          defaultValue="point"
        >
          <TabsList
            className="grid w-full grid-cols-2"
            aria-label="Manage your account"
          >
            <TabsTrigger
              value="point"
              tooltipText="Point"
              // portalContainer={mapInstance.getContainer()}
            >
              <HiOutlineMapPin className="cursor-pointer" /> &nbsp;
              <span>Point</span>
            </TabsTrigger>
            {pickerData?.plot && (
              <TabsTrigger value="plot" tooltipText="Plot">
                <FaRegMap className="cursor-pointer" />
                &nbsp;
                <span>Plot</span>
              </TabsTrigger>
            )}
          </TabsList>
          <br />
          <TabContent value="point">
            <NdviChart point={pickerData.coordinates} />
          </TabContent>
          {pickerData?.plot && (
            <TabContent value="plot">
              <NdviChart plot={pickerData.plot} />
            </TabContent>
          )}
        </Tabs>
      </MyModal>
    </>
  );
}
