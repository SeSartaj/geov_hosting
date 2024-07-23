import { useState } from 'react';
import { BiCollapseHorizontal, BiExpandHorizontal } from 'react-icons/bi';
import SidebarBody from './SidebarBody';

export default function Navigation() {
  const [expand, setExpand] = useState(false);

  return (
    <div className='sidebar'>
      {(expand && (
        <div>
          <BiCollapseHorizontal onClick={() => setExpand(false)} />
          <SidebarBody />
        </div>
      )) || <BiExpandHorizontal onClick={() => setExpand(true)} />}
    </div>
  );
}
