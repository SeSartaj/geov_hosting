import * as Tabs from '@radix-ui/react-tabs';
import MyTip from '../../MyTip';
import { BiFilter, BiGlobe, BiLayer } from 'react-icons/bi';
import BaseMapPanel from '../BaseMapPanel';
import './styles.css';
import LayerPanel from '../LayerPanel';

const Navigation = () => (
  <Tabs.Root className='TabsRoot' defaultValue='tab1'>
    <Tabs.List className='TabsList' aria-label='Manage your account'>
      <Tabs.Trigger className='TabsTrigger' value='tab1'>
        <MyTip text='layers'>
          <BiLayer className='action-icon' />
        </MyTip>
      </Tabs.Trigger>
      <Tabs.Trigger className='TabsTrigger' value='tab2'>
        <MyTip text='filters'>
          <BiFilter className='action-icon' />
        </MyTip>
      </Tabs.Trigger>
      <Tabs.Trigger className='TabsTrigger' value='tab3'>
        <MyTip text='base map'>
          <BiGlobe className='action-icon' />
        </MyTip>
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content className='TabsContent' value='tab1'>
      <LayerPanel />
    </Tabs.Content>
    <Tabs.Content className='TabsContent' value='tab2'>
      Filters
    </Tabs.Content>
    <Tabs.Content className='TabsContent' value='tab3'>
      <BaseMapPanel />
    </Tabs.Content>
  </Tabs.Root>
);

export default Navigation;
