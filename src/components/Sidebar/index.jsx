import { useState } from 'react';
import { BiCollapseHorizontal, BiExpandHorizontal } from 'react-icons/bi';
import SidebarBody from './SidebarBody';
import './styles.css';
import MyButton from '@/ui-components/MyButton';

export default function Navigation() {
  const [expand, setExpand] = useState(true);

  if (!expand)
    return (
      <div className='sidebar rounded-sm bg-gray-100'>
        <MyButton
          onClick={() => setExpand(true)}
          variant='icon'
          className='bg-gray-50 hover:bg-gray-300'
        >
          <BiExpandHorizontal
            className='sidebar-button'
            onClick={() => setExpand(true)}
            size={20}
          />
        </MyButton>
      </div>
    );

  return (
    <div className='sidebar sidebar-expanded rounded-sm bg-gray-100'>
      <div className='flex justify-between items-center'>
        <MyButton
          onClick={() => setExpand(false)}
          variant='icon'
          className='bg-gray-50 hover:bg-gray-300'
        >
          <BiCollapseHorizontal
            className='sidebar-button'
            onClick={() => setExpand(false)}
            size={20}
          />
        </MyButton>

        <h1 className='text-lg pr-2 text-black'>GEOVis</h1>
      </div>
      <SidebarBody />
    </div>
  );
}
