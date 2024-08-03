import React, { useContext, useState } from 'react';
import MyButton from '../../ui-components/MyButton';
import { PlotContext } from '../../contexts/PlotContext';

export default function PolygonDrawActionsPopup({ polygon }) {
  const { plots, addNewPlot } = useContext(PlotContext);
  const [plotName, setPlotName] = useState('');

  const handleAddPlot = () => {
    let mpolygon = polygon.features[0];
    mpolygon = {
      ...mpolygon,
      properties: {
        name: plotName,
      },
    };

    addNewPlot(mpolygon);
  };
  return (
    <div className='draw-actions'>
      <input
        name='plotname'
        placeholder='plot name'
        value={plotName}
        onChange={(e) => setPlotName(e.target.value)}
      />
      <MyButton onClick={handleAddPlot}>add plot</MyButton>
    </div>
  );
}
