import { useState } from 'react';
import { SidebarCloseIcon } from 'lucide-react';
import './styles.css';
import MyButton from '@/ui-components/MyButton';
import useMapStore from '@/stores/mapStore';
import Card from '@/ui-components/Card';
import MarkerPanel from '../MarkerPanel';
import LayerPanel from './LayerPanel';
import { maxWidth } from '@/constants/index';

const divider = (
  <div className="h-[1px] bg-[#E9E9E9] dark:bg-zinc-100 w-[calc(100%+20px)] mx-auto" />
);

export default function Navigation() {
  const viewMode = useMapStore((state) => state.viewMode);
  const [expand, setExpand] = useState(true);

  if (!expand)
    return (
      <div className="sidebar bg-gray-100 dark:bg-gray-900 rounded">
        <MyButton onClick={() => setExpand(true)} variant="icon">
          <SidebarCloseIcon onClick={() => setExpand(true)} />
        </MyButton>
      </div>
    );

  return (
    <Card
      className={`sidebar sidebar-expanded rounded-sm bg-white dark:bg-gray-900 h-[calc(100%-32px)] ${maxWidth}`}
      header={
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-lg pr-2 text-black dark:text-white">
            Configurations
          </h1>
          <MyButton onClick={() => setExpand(false)} variant="icon">
            <SidebarCloseIcon onClick={() => setExpand(false)} />
          </MyButton>
        </div>
      }
    >
      <MarkerPanel />
      {divider}
      <LayerPanel />
    </Card>
  );
}
