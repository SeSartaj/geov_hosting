import { useContext, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { MarkersContext } from '../../contexts/markersContext';
import { getStationMarkerColor } from '../../utils/getStationMarkerColor';
import './styles.css';
import useMapStore from '@/stores/mapStore';
import Card from '@/ui-components/Card';

const markerObj = {
  OPTIMAL: 'Optimal',
  STRESS_START: 'Stress Start',
  SEVERE_STRESS: 'Severe Stress',
  EXCESS_WATER: 'Excess Water',
};

export default function PAWStatusPieChart() {
  const { markersData, showMarkers } = useContext(MarkersContext);
  const viewMode = useMapStore((state) => state.viewMode);

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
    name: markerObj?.[status],
    value: statusCounts[status],
    color: getStationMarkerColor(status),
  }));

  const totalCount = useMemo(() => {
    return data?.reduce(
      (accumulator, currentValue) => accumulator + currentValue?.value,
      0
    );
  }, [data]);

  console.log('sum', totalCount);

  return viewMode === 'PICKER' || !showMarkers || !data.length > 0 ? null : (
    <div className="paw-pie-chart ">
      <PieChart width={115} height={115}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={50}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
