import * as Tabs from '@radix-ui/react-tabs';
import { BiFilter, BiGlobe, BiLayer, BiLibrary } from 'react-icons/bi';
import BaseMapPanel from '../BaseMapPanel';
import './styles.css';
import LayerPanel from '../LayerPanel';
import Tooltip from '../../Tooltip';
import SourcesPanel from '../../SourcesPanel';

const Navigation = () => (
  <Tabs.Root className='TabsRoot' defaultValue='tab4'>
    <Tabs.List className='TabsList' aria-label='Manage your account'>
      <Tabs.Trigger className='TabsTrigger' value='tab1'>
        <Tooltip text='layers'>
          <BiLayer className='action-icon' />
        </Tooltip>
      </Tabs.Trigger>
      <Tabs.Trigger className='TabsTrigger' value='tab2'>
        <Tooltip text='filters'>
          <BiFilter className='action-icon' />
        </Tooltip>
      </Tabs.Trigger>
      <Tabs.Trigger className='TabsTrigger' value='tab3'>
        <Tooltip text='base map'>
          <BiGlobe className='action-icon' />
        </Tooltip>
      </Tabs.Trigger>
      <Tabs.Trigger className='TabsTrigger' value='tab4'>
        <Tooltip text='Sources'>
          <BiLibrary className='action-icon' />
        </Tooltip>
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
    <Tabs.Content className='TabsContent' value='tab4'>
      <SourcesPanel />
    </Tabs.Content>
  </Tabs.Root>
);

export default Navigation;
