import { useState } from 'react';
import { SidebarCloseIcon, SidebarOpenIcon } from 'lucide-react';
import './styles.css';
import MyButton from '@/ui-components/MyButton';
import useMapStore from '@/stores/mapStore';
import Card from '@/ui-components/Card';
import MarkerPanel from '../MarkerPanel';
import LayerPanel from './LayerPanel';
import { maxWidth } from '@/constants/index';
import { VIEW_MODES } from '@/stores/mapStore';
const divider = (
  <div className="h-[1px] bg-[#E9E9E9] dark:bg-zinc-100 w-[calc(100%+20px)] mx-auto" />
);

export default function Navigation() {
  const sidebarExpanded = useMapStore((state) => state.sidebarExpanded);
  const setSidebarExpanded = useMapStore((state) => state.setSidebarExpanded);

  return (
    <>
      {!sidebarExpanded && (
        <div className="sidebar-opener bg-white dark:bg-gray-900 mt-3 ">
          <MyButton variant="icon" className="border-left-0">
            <SidebarOpenIcon onClick={() => setSidebarExpanded(true)} />
          </MyButton>
        </div>
      )}
      <Card
        className={`sidebar ${
          sidebarExpanded && 'sidebar-expanded'
        } rounded-l-none  h-full ${maxWidth} `}
        header={
          <div className="flex justify-between items-center mb-1">
            <h1 className="text-lg pr-2 text-black dark:text-white">
              Configurations
            </h1>
            <div className="bg-white dark:bg-gray-900 ">
              <MyButton variant="icon" className="border-left-0">
                {sidebarExpanded ? (
                  <SidebarCloseIcon onClick={() => setSidebarExpanded(false)} />
                ) : (
                  <SidebarOpenIcon onClick={() => setSidebarExpanded(true)} />
                )}
              </MyButton>
            </div>
          </div>
        }
      >
        <MarkerPanel />
        {divider}
        <LayerPanel />
      </Card>
    </>
  );
}
