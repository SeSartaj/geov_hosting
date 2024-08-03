import { useContext } from 'react';
import MyButton from '../../ui-components/MyButton';
import { PlotContext } from '../../contexts/PlotContext';
import { MapContext } from '../../contexts/MapContext';

export default function PlotPanel() {
  const { plots } = useContext(PlotContext);
  const { mapRef } = useContext(MapContext);

  const handleFlyToPlot = (coordinates) => {
    const map = mapRef.current.getMap();
    if (map) {
      map.flyTo({
        center: coordinates,
        zoom: 16,
        essential: true,
      });
    }
  };

  console.log(plots);

  return (
    <div className='panel-container'>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Plots</h3>
        <MyButton>Add new Plot</MyButton>
      </div>
      <ul className='plot-list'>
        {plots.map((plot, index) => (
          <li
            key={index}
            onClick={() => handleFlyToPlot(plot.geometry.coordinates[0][0])}
          >
            {plot.properties.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
