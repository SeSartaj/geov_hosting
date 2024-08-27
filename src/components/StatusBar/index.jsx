import { MapContext } from '@/contexts/MapContext';
import React, { useContext } from 'react';

const StatusBar = () => {
  console.log('rendering status Bar');
  const { mode, status } = useContext(MapContext);
  return (
    <div className='absolute bottom-0 left-0 w-full  bg-black bg-opacity-50 p-1 text-xs text-white'>
      mode: {mode} | status: {status}
    </div>
  );
};

export default StatusBar;
