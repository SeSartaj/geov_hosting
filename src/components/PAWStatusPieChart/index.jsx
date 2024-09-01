import { useContext } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { MarkersContext } from '../../contexts/markersContext';
import { getStationMarkerColor } from '../../utils/getStationMarkerColor';
import './styles.css';

export default function PAWStatusPieChart() {
  const { markersData, showMarkers } = useContext(MarkersContext);

  // Group markers by their paw_status
  const statusCounts = markersData.reduce((acc, marker) => {
    const status = marker.paw_status;
    if (status) {
      acc[status] = (acc[status] || 0) + 1;
    }
    return acc;
  }, {});

  // Convert the grouped data into an array for the PieChart
  const data = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
    color: getStationMarkerColor(status),
  }));

  if (!showMarkers || !data.length > 0) return null;

  return (
    <div>
      <PieChart width={200} height={200} className='paw-pie-chart'>
        <Pie
          data={data}
          dataKey='value'
          nameKey='name'
          cx='50%'
          cy='50%'
          outerRadius={50}
          fill='#8884d8'
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend className='pawchart-legend' />
      </PieChart>
    </div>
  );
}
