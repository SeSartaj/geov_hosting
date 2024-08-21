import { PlotContext } from '@/contexts/PlotContext';
import Input from '@/ui-components/Input';
import { useContext } from 'react';

export default function NdviLayerPanel() {
  const { weeksBefore, setWeeksBefore } = useContext(PlotContext);
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
    </div>
  );
}
