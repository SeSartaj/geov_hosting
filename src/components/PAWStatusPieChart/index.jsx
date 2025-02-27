import { useContext, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { MarkersContext } from '../../contexts/markersContext';
import { getStationMarkerColor } from '../../utils/getStationMarkerColor';
import './styles.css';
import useMapStore from '@/stores/mapStore';
import Card from '@/ui-components/Card';
import { useIntl } from 'react-intl';



export default function PAWStatusPieChart() {
  const { markersData, showMarkers } = useContext(MarkersContext);
  const viewMode = useMapStore((state) => state.viewMode);
  const intl = useIntl();

  const markerObj = {
    OPTIMAL: intl.formatMessage({ id: 'app.agviewer_map.optimal', defaultMessage: 'Optimal' }),
    STRESS_START: intl.formatMessage({ id: 'app.agviewer_map.stress_start', defaultMessage: 'Stress Start' }),
    SEVERE_STRESS: intl.formatMessage({ id: 'app.agviewer_map.severe_stress', defaultMessage: 'Severe Stress' }),
    EXCESS_WATER: intl.formatMessage({ id: 'app.agviewer_map.excess_water', defaultMessage: 'Excess Water' }),
  };

  // Group markers by their paw_status
  const statusCounts = markersData.reduce((acc, marker) => {
    const status = marker.paw_status;
    if (status) {
      acc[status] = (acc[status] || 0) + 1;
    }
    return acc;
  }, {});

  // for now delete WEATHER_STATIONS count maybe we use it later
  delete statusCounts['WEATHER_STATION'];

  // Convert the grouped data into an array for the PieChart
  const data = Object.keys(statusCounts).map((status) => {
    return {
      name: markerObj?.[status],
      value: statusCounts[status],
      color: getStationMarkerColor(status),
    };
  });

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const totalCount = useMemo(() => {
    return data?.reduce(
      (accumulator, currentValue) => accumulator + currentValue?.value,
      0
    );
  }, [data]);

  console.log('sum', totalCount);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            boxShadow: `0 0 0 1px ${payload[0]?.payload?.color}`,
            backgroundColor: 'rgba(0,0,0,0.59)',
            padding: '4px',
            borderRadius: '6px',
          }}
        >
          <p className="label text-white">{`${payload[0]?.name} : ${payload[0]?.value}`}</p>
        </div>
      );
    }

    return null;
  };

  return viewMode === 'PICKER' || !showMarkers || !data.length > 0 ? null : (
    <div className="paw-pie-chart ">
      <PieChart width={115} height={115}>
        <Pie
          labelLine={false}
          label={renderCustomizedLabel}
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
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </div>
  );
}
