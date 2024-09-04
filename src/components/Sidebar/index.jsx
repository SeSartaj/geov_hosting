import { useState } from 'react';
import { BiCollapseHorizontal, BiExpandHorizontal } from 'react-icons/bi';
import SidebarBody from './SidebarBody';
import './styles.css';
import MyButton from '@/ui-components/MyButton';
import useMapStore from '@/stores/mapStore';

export default function Navigation() {
  const viewMode = useMapStore((state) => state.viewMode);
  const [expand, setExpand] = useState(true);

  if (viewMode === 'PICKER') {
    return null;
  }

  if (!expand)
    return (
      <div className='sidebar bg-gray-100 dark:bg-gray-900 rounded'>
        <MyButton onClick={() => setExpand(true)} variant='icon'>
          <BiExpandHorizontal
            className='sidebar-button'
            onClick={() => setExpand(true)}
            size={20}
          />
        </MyButton>
      </div>
    );

  return (
    <div className='sidebar sidebar-expanded rounded-sm bg-gray-100 dark:bg-gray-900'>
      <div className='flex justify-between items-center mb-1'>
        <MyButton onClick={() => setExpand(false)} variant='icon'>
          <BiCollapseHorizontal
            className='sidebar-button'
            onClick={() => setExpand(false)}
            size={20}
          />
        </MyButton>

        <h1 className='text-lg pr-2 text-black dark:text-white'>GEOVis</h1>
      </div>
      <SidebarBody />
    </div>
  );
}
