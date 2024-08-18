import { useContext, useDebugValue, useEffect, useState } from 'react';
import { PlotContext } from '../../contexts/PlotContext';
import { calculatePolygonArea } from '../../utils/calculatePolygonArea';
import { squareMetersToAcres } from '../../utils/squareMetersToAcres';
import { BiPencil } from 'react-icons/bi';
import ToggleButton from '@/ui-components/toggleButton';
import MyButton from '@/ui-components/MyButton';

export default function PlotPanel() {
  const {
    plots,
    showPlots,
    setShowPlots,
    handleFlyToPlot,
    handleEditPlot,
    weeksBefore,
    setWeeksBefore,
  } = useContext(PlotContext);

  return (
    <div className='panel-container'>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Plots</h3>
        {/* <MyButton>Add new Plot</MyButton> */}
        <ToggleButton
          onTooltip='hide plots'
          offTooltip='show plots'
          initialState={showPlots}
          onToggle={setShowPlots}
        />
      </div>
      <hr className='my-1' />
      <input
        type='range'
        min='0'
        max='52'
        value={weeksBefore}
        onChange={(e) => setWeeksBefore(e.target.value)}
        style={{ direction: 'rtl' }}
        className='w-full'
      />
      <span className='flex flex-row justify-between items-center'>
        {new Date(
          new Date().setDate(new Date().getDate() - weeksBefore * 7)
        ).toLocaleDateString()}
      </span>
      <hr className='my-2' />
      <ul className='overflow-y-scroll'>
        {plots.map((plot, index) => (
          <li
            key={index}
            className='inline-flex justify-between items-center p-2 border w-full'
          >
            <span onClick={() => handleFlyToPlot(plot.geometry.coordinates)}>
              {plot.properties.name}(
              {squareMetersToAcres(calculatePolygonArea(plot)).toFixed(1)}
              acres)
            </span>
            <span onClick={() => handleEditPlot(plot)}>
              <BiPencil className='action-icon' />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
