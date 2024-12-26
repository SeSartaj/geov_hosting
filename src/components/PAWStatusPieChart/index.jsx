import { useContext } from 'react';
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

  if (viewMode === 'PICKER') {
    return null;
  }

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

  if (!showMarkers || !data.length > 0) return null;

  return (
    <Card className="paw-pie-chart bg-white dark:bg-gray-900 p-0">
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
      <div className="flex flex-col gap-2">
        {data?.map((entry, index) => (
          <div key={index} className="flex items-center gap-1 justify-between">
            <span className="text-[8px] font-semibold">{entry.name}</span>
            <span
              className="text-[8px] font-semibold text-center w-10 bg-gray-200 dark:bg-gray-700 rounded-md"
              style={{
                color: entry.color,
              }}
            >
              {entry?.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
