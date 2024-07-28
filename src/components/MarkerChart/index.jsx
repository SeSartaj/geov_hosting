import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const SAMPLE_DATA = [
  { time: '2024-07-01', humidity: 45 },
  { time: '2024-07-02', humidity: 50 },
  { time: '2024-07-03', humidity: 55 },
  { time: '2024-07-04', humidity: 60 },
  { time: '2024-07-05', humidity: 65 },
  { time: '2024-07-06', humidity: 70 },
  { time: '2024-07-07', humidity: 60 },
  { time: '2024-07-08', humidity: 35 },
  { time: '2024-07-09', humidity: 80 },
  { time: '2024-07-10', humidity: 58 },
  { time: '2024-07-11', humidity: 86 },
  { time: '2024-08-12', humidity: 56 },
  { time: '2024-08-12', humidity: 90 },
  { time: '2024-08-12', humidity: 45 },
  { time: '2024-08-12', humidity: 86 },
  { time: '2024-08-12', humidity: 40 },
];

const HumidityChart = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height={100}>
      <LineChart
        data={SAMPLE_DATA}
        margin={{ top: 0, right: 10, left: -30, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          tick={false}
          dataKey='time'
          tickFormatter={(time) => new Date(time).toLocaleDateString()}
        />
        <YAxis tick={{ fontSize: 9 }} />
        <Tooltip
          labelFormatter={(time) => new Date(time).toLocaleDateString()}
        />
        <Line type='monotone' dataKey='humidity' stroke='#8884d8' dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HumidityChart;
