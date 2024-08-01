import * as Tabs from '@radix-ui/react-tabs';
import {
  BiDroplet,
  BiFilter,
  BiGlobe,
  BiLayer,
  BiLibrary,
  BiMapPin,
} from 'react-icons/bi';
import BaseMapPanel from '../BaseMapPanel';
import './styles.css';
import LayerPanel from '../LayerPanel';
import Tooltip from '../../Tooltip';
import SourcesPanel from '../../SourcesPanel';
import { HiOutlineMapPin } from 'react-icons/hi2';
import MarkerPanel from '../../MarkerPanel';
import { FaRegMap } from 'react-icons/fa';
import FarmPanel from '../../FarmPanel';
import { useContext } from 'react';
import { MapContext } from 'react-map-gl/dist/esm/components/map';

const Navigation = () => {
  const { mapRef } = useContext(MapContext);

  return (
    <Tabs.Root className='TabsRoot' defaultValue='tab1'>
      <Tabs.List className='TabsList' aria-label='Manage your account'>
        <Tabs.Trigger className='TabsTrigger' value='tab1'>
          <Tooltip
            text='Markers'
            portalContainer={mapRef?.current?.getMap()?.getContainer()}
          >
            <HiOutlineMapPin className='action-icon' />
          </Tooltip>
        </Tabs.Trigger>
        <Tabs.Trigger className='TabsTrigger' value='farmPanel'>
          <Tooltip
            text='Farms'
            portalContainer={mapRef?.current?.getMap()?.getContainer()}
          >
            <FaRegMap className='action-icon' />
          </Tooltip>
        </Tabs.Trigger>

        {/* <Tabs.Trigger className='TabsTrigger' value='tab2'>
        <Tooltip text='filters'>
          <BiFilter className='action-icon' />
        </Tooltip>
      </Tabs.Trigger> */}
        <Tabs.Trigger className='TabsTrigger' value='tab3'>
          <Tooltip
            text='base map'
            portalContainer={mapRef?.current?.getMap()?.getContainer()}
          >
            <BiGlobe className='action-icon' />
          </Tooltip>
        </Tabs.Trigger>
        <Tabs.Trigger className='TabsTrigger' value='tab4'>
          <Tooltip
            text='Sources'
            portalContainer={mapRef?.current?.getMap()?.getContainer()}
          >
            <BiLibrary className='action-icon' />
          </Tooltip>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className='TabsContent' value='tab1'>
        <MarkerPanel />
      </Tabs.Content>
      <Tabs.Content className='TabsContent' value='tab2'>
        Filters
      </Tabs.Content>
      <Tabs.Content className='TabsContent' value='tab3'>
        <BaseMapPanel />
      </Tabs.Content>
      <Tabs.Content className='TabsContent' value='tab4'>
        <SourcesPanel />
      </Tabs.Content>
      <Tabs.Content className='TabsContent' value='farmPanel'>
        <FarmPanel />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default Navigation;
