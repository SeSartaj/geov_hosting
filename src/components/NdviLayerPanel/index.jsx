import { MapContext } from '@/contexts/MapContext';
import { PlotContext } from '@/contexts/PlotContext';
import Input from '@/ui-components/Input';
import { useContext, useEffect, useState } from 'react';

export default function NdviLayerPanel() {
  const { weeksBefore, setWeeksBefore, changeNdviLayerOpacity } =
    useContext(PlotContext);
  const [opacity, setOpacity] = useState(100);

  const handleOpacityChange = (e) => {
    setOpacity(e.target.value);
    changeNdviLayerOpacity(e.target.value);
  };

  return (
    <div>
      <hr />
      <span className='font-light'>
        Time Range:
        <span className='text-light'>
          (
          {new Date(
            new Date().setDate(new Date().getDate() - weeksBefore * 7)
          ).toLocaleDateString()}
          )
        </span>
      </span>
      <Input
        type='range'
        min='0'
        max='52'
        value={weeksBefore}
        onChange={(e) => setWeeksBefore(e.target.value)}
        style={{ direction: 'rtl' }}
        className='w-full'
      />
      <hr />
      <span>Opacity</span>
      <Input
        type='range'
        min='0'
        max='100'
        value={opacity}
        onChange={handleOpacityChange}
        className='w-full'
      />
    </div>
  );
}
