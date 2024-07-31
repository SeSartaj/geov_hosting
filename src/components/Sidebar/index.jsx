import { useState } from 'react';
import { BiCollapseHorizontal, BiExpandHorizontal } from 'react-icons/bi';
import SidebarBody from './SidebarBody';
import './styles.css';

export default function Navigation() {
  const [expand, setExpand] = useState(true);

  if (!expand)
    return (
      <div className='sidebar '>
        <BiExpandHorizontal
          className='sidebar-button'
          onClick={() => setExpand(true)}
        />
      </div>
    );

  return (
    <div className='sidebar sidebar-expanded'>
      <BiCollapseHorizontal
        className='sidebar-button'
        onClick={() => setExpand(false)}
      />
      <SidebarBody />
    </div>
  );
}
