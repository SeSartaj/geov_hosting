import * as Tabs from '@radix-ui/react-tabs';
import { BiGlobe, BiLayer, BiLibrary } from 'react-icons/bi';
import BaseMapPanel from '../BaseMapPanel';
import LayerPanel from '../LayerPanel';
import SourcesPanel from '../../SourcesPanel';
import { HiOutlineMapPin } from 'react-icons/hi2';
import MarkerPanel from '../../MarkerPanel';
import { FaRegMap } from 'react-icons/fa';
import PlotPanel from '../../PlotPanel';
import { useContext } from 'react';
import { MapContext } from 'react-map-gl/dist/esm/components/map';
import { TabContent, TabTrigger } from '@/ui-components/Tabs';
import { FaGear } from 'react-icons/fa6';
import { PiGear } from 'react-icons/pi';
import useMapStore from '@/stores/mapStore';

const Navigation = () => {
  const { mapRef } = useContext(MapContext);
  const viewMode = useMapStore((state) => state.viewMode);

  if (viewMode === 'PICKER') {
    return <LayerPanel />;
  }

  return (
    <Tabs.Root
      className='flex flex-col w-[300px] h-full overflow-y-hidden'
      defaultValue='tab1'
    >
      <Tabs.List
        className='flex flex-shrink-0 justify-start '
        aria-label='Manage your account'
      >
        <TabTrigger
          value='tab1'
          tooltipText='Markers'
          portalContainer={mapRef?.current?.getMap()?.getContainer()}
        >
          <HiOutlineMapPin className='cursor-pointer' />
        </TabTrigger>
        <TabTrigger value='plotPanel' tooltipText='Plots'>
          <FaRegMap className='cursor-pointer' />
        </TabTrigger>
        <TabTrigger value='layers' tooltipText='Layers'>
          <BiLayer className='cursor-pointer' />
        </TabTrigger>

        <TabTrigger value='settings' tooltipText='Map Settings'>
          <PiGear className='cursor-pointer' />
        </TabTrigger>
      </Tabs.List>

      <TabContent value='tab1'>
        <MarkerPanel />
      </TabContent>

      <TabContent value='settings'>
        <BaseMapPanel />
      </TabContent>

      <TabContent value='plotPanel'>
        <PlotPanel />
      </TabContent>

      <TabContent value='layers'>
        <LayerPanel />
      </TabContent>
    </Tabs.Root>
  );
};

export default Navigation;
