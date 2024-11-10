import * as Tabs from '@radix-ui/react-tabs';
import { BiLayer } from 'react-icons/bi';
import { HiOutlineMapPin } from 'react-icons/hi2';
import { FaRegMap } from 'react-icons/fa';
import { PiGear } from 'react-icons/pi';
import { useContext, useMemo } from 'react';
import { MapContext } from 'react-map-gl/dist/esm/components/map';
import { MyTabs } from '@/ui-components/Tabs';
import useMapStore from '@/stores/mapStore';
import BaseMapPanel from '../BaseMapPanel';
import LayerPanel from '../LayerPanel';
import MarkerPanel from '../../MarkerPanel';
import PlotPanel from '../../PlotPanel';

const Navigation = () => {
  const viewMode = useMapStore((state) => state.viewMode);

  const tabs = useMemo(
    () => [
      {
        id: 'markers',
        title: 'Markers',
        icon: <HiOutlineMapPin />,
        content: <MarkerPanel />,
      },
      {
        id: 'plots',
        title: 'Plots',
        icon: <FaRegMap />,
        content: <PlotPanel />,
      },
      {
        id: 'layers',
        title: 'Layers',
        icon: <BiLayer />,
        content: <LayerPanel />,
      },
      {
        id: 'settings',
        title: 'Settings',
        icon: <PiGear />,
        content: <BaseMapPanel />,
      },
    ],
    []
  );

  if (viewMode === 'PICKER') {
    return <LayerPanel />;
  }

  return <MyTabs defaultId="markers" tabs={tabs} />;
};

export default Navigation;
