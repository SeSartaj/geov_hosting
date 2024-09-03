import { MapContext } from '@/contexts/MapContext';
import useMapStore from '@/stores/mapStore';
import React, { useContext } from 'react';

const StatusBar = () => {
  const viewMode = useMapStore((state) => state.viewMode);
  console.log('viewMode', viewMode);
  return (
    <div className='absolute bottom-0 left-0 w-full  bg-black bg-opacity-50 p-1 text-xs text-white'>
      mode: {viewMode}
    </div>
  );
};

export default StatusBar;
