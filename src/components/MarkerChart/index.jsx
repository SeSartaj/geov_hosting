import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

import { getPawData } from '../../api/markerApi';
import { BiLoader } from 'react-icons/bi';
import Spinner from '@/ui-components/Spinner';

function getHumidityStats(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return { min: null, max: null, avg: null };
  }

  let sum = 0;
  let min = Infinity;
  let max = -Infinity;

  data.forEach(([_, value]) => {
    if (typeof value === 'number') {
      sum += value;
      if (value < min) min = value;
      if (value > max) max = value;
    }
  });

  const avg = sum / data.length;
  return { min: min?.toFixed(2), max: max?.toFixed(2), avg: avg?.toFixed(2) };
}

const HumidityChart = ({ marker }) => {
  const [pawData, setPawData] = useState([]);
  const [loading, setLoading] = useState(true);

  const PAW_BANDS = [
    {
      from: 0,
      to: 30,
      color: 'rgba(255,179,186,.3)',
      label: {
        text: 'severe stress',
        align: 'left',
        style: { color: '#888', fontSize: '12px', fontWeight: '100' },
      },
    },
    {
      from: 30,
      to: 70,
      color: 'rgba(255,255,186,.3)',
      label: {
        text: 'stress start',
        align: 'left',
        style: { color: '#888', fontSize: '12px', fontWeight: '100' },
      },
    },
    {
      from: 70,
      to: 100,
      color: 'rgba(186,255,201,.3)',
      label: {
        text: 'optimal',
        align: 'left',
        style: { color: '#888', fontSize: '12px', fontWeight: '100' },
      },
    },
    {
      from: 100,
      to: 200,
      color: 'rgba(110,192,255,.3)',
      label: {
        text: 'excess water',
        align: 'left',
        style: { color: '#888', fontSize: '12px', fontWeight: '100' },
      },
    },
  ];

  const hichartOptions = {
    time: {
      timezone: 'UTC',
    },
    chart: {
      backgroundColor: null,
      borderWidth: 0,
      type: 'line',
      margin: [10, 0, 5, 0],
      height: 90,
      style: {
        overflow: 'visible',
      },
      skipClone: true,
    },
    title: {
      text: '',
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
      startOnTick: false,
      endOnTick: false,
      //   tickPositions: [],
      type: 'datetime',
      //   categories: oneWeekGraphData.date
    },
    yAxis: {
      plotBands: PAW_BANDS,
      min: 0,
      max: 180,
      endOnTick: false,
      startOnTick: false,
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
      tickPositions: [0],
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      hideDelay: 0,
      outside: true,
      shared: true,
      pointFormat: `<b>{point.y}</b>`,
    },
    plotOptions: {
      series: {
        animation: false,
        lineWidth: 1,
        shadow: false,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        marker: {
          radius: 1,
          states: {
            hover: {
              radius: 2,
            },
          },
        },
        fillOpacity: 0.25,
      },
      column: {
        negativeColor: '#910000',
        borderColor: 'silver',
      },
    },

    series: [
      {
        data: pawData?.series,
      },
    ],
  };

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        // this is temporary for testing, user marker.id instead
        const data = await getPawData(marker?.id);
        const { min, max, avg } = getHumidityStats(data);
        setPawData({ series: data, min, max, avg });
      } catch (error) {
        console.log('error fetching paw data');
      } finally {
        setLoading(false);
      }
    };

    fetchdata();
  }, [marker]);

  if (loading) return <Spinner />;

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={hichartOptions} />
      <div className="flex items-center justify-between w-full gap-2 rounded-bl-md rounded-br-md bg-zinc-100 dark:bg-zinc-800 p-2 mt-0 mb-2">
        <span className="flex gap-1">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            min:
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {pawData.min}
            </span>
          </div>
        </span>
        <span className="flex gap-1">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            avg:
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {pawData.avg}
            </span>
          </div>
        </span>
        <span className="flex gap-1">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            max:
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {pawData.max}
            </span>
          </div>
        </span>
      </div>
    </>
  );
};

export default HumidityChart;
