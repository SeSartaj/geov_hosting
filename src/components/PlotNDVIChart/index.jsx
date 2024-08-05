import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from 'recharts';
import { BiLoader } from 'react-icons/bi';

const SAMPLE_NDVI_DATA = [
  [1721728800000, 0.23],
  [1721754000000, 0.45],
  [1721757600000, 0.34],
  [1721977200000, 0.15],
  [1721980800000, 0.2],
  [1721984400000, 0.23],
];

const transformNdviData = (data) => {
  return data.map(([timestamp, ndvi]) => ({
    time: timestamp,
    ndvi,
  }));
};

const transformedNdviData = transformNdviData(SAMPLE_NDVI_DATA);

const NdviChart = ({ plot }) => {
  const [ndviData, setNdviData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // this is temporary for testing, user marker.id instead
        // const data = await getNdviData(8386);
        setNdviData(transformedNdviData);
      } catch (error) {
        console.log('Error fetching NDVI data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <BiLoader />;

  return (
    <ResponsiveContainer width='100%' height={100}>
      <LineChart
        data={ndviData.length ? ndviData : transformedNdviData} // Use fetched data if available, else use sample data
        margin={{ top: 0, right: 10, left: -30, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <ReferenceArea y1={-1} y2={0} fill='blue' fillOpacity={0.3} />
        <ReferenceArea y1={0} y2={0.2} fill='brown' fillOpacity={0.3} />
        <ReferenceArea y1={0.2} y2={0.5} fill='lightgreen' fillOpacity={0.3} />
        <ReferenceArea y1={0.5} y2={1} fill='green' fillOpacity={0.3} />
        <XAxis
          tick={false}
          dataKey='time'
          tickFormatter={(time) => new Date(time).toLocaleDateString()}
        />
        <YAxis tick={{ fontSize: 9 }} domain={[-1, 1]} />
        <Tooltip
          labelFormatter={(time) => new Date(time).toLocaleDateString()}
        />
        <Line type='monotone' dataKey='ndvi' stroke='#333' dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default NdviChart;
