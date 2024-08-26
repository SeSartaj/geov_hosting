import { MapContext } from '@/contexts/MapContext';
import React, { useContext } from 'react';

const StatusBar = () => {
  const { mode } = useContext(MapContext);
  return (
    <div className='absolute bottom-0 left-0 w-full  bg-black bg-opacity-50 p-1 text-xs text-white'>
      mode: {mode} | status: idle
    </div>
  );
};

export default StatusBar;
