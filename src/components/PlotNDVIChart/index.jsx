import { useContext, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchMeanNDVI, fetchMeanNDVIForPoint } from '@/api/sentinalHubApi';
import Spinner from '@/ui-components/Spinner';
import { AccessTokenContext } from '@/contexts/AccessTokenProvider';

function parseNDVIData(data) {
  if (!data || !data.length) return [];

  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  let count = 0;

  const parsedData = data
    .map((entry) => {
      const date = entry?.interval?.from;
      const meanNDVI = entry?.outputs?.data?.bands?.B0?.stats?.mean;

      if (meanNDVI !== undefined) {
        min = Math.min(min, meanNDVI);
        max = Math.max(max, meanNDVI);
        sum += meanNDVI;
        count++;
      }

      return {
        x: date ? new Date(date).getTime() : null,
        y: meanNDVI !== undefined ? meanNDVI : null,
      };
    })
    .filter((entry) => entry.x !== null && entry.y !== null);

  const average = count > 0 ? sum / count : null;

  return {
    parsedData,
    min: min.toFixed(2),
    max: max.toFixed(2),
    average: average.toFixed(2),
  };
}

const NdviChart = ({ plot, point }) => {
  const [ndviData, setNdviData] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = useContext(AccessTokenContext);

  const ndviChartOptions = {
    chart: {
      backgroundColor: null,
      borderWidth: 0,
      type: 'line',
      margin: [0, 0, 0, 0],
      height: 100,
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
      min: -1,
      max: 1,
      title: {
        text: null,
      },
      gridLineWidth: 0,
      lineWidth: 0,
      plotBands: [
        {
          from: -1,
          to: 0,
          color: 'rgba(0, 0, 255, 0.3)', // Blue
          label: {
            text: 'water',
            align: 'left',
            style: { color: '#888', fontSize: '12px', fontWeight: '100' },
          },
        },
        {
          from: 0,
          to: 0.2,
          color: 'rgba(165, 42, 42, 0.3)', // Brown
          label: {
            text: 'bare soil',
            align: 'left',
            style: { color: '#888', fontSize: '12px', fontWeight: '100' },
          },
        },
        {
          from: 0.2,
          to: 0.4,
          color: 'rgba(144, 238, 144, 0.3)', // Light Green
          label: {
            text: 'light veg',
            align: 'left',
            style: { color: '#888', fontSize: '12px', fontWeight: '100' },
          },
        },
        {
          from: 0.4,
          to: 0.6,
          color: 'rgba(16, 213, 16, 0.3)', // Light Green
          label: {
            text: 'moderate veg',
            align: 'left',
            style: { color: '#888', fontSize: '12px', fontWeight: '100' },
          },
        },
        {
          from: 0.6,
          to: 0.8,
          color: 'rgba(0, 128, 0, 0.3)', // Green
          label: {
            text: 'dense veg',
            align: 'left',
            style: { color: '#888', fontSize: '12px', fontWeight: '100' },
          },
        },
        {
          from: 0.8,
          to: 1,
          color: 'rgba(10, 125, 10, 0.3)', // Dark Green
          label: {
            text: 'irrigated',
            align: 'left',
            style: { color: '#888', fontSize: '12px', fontWeight: '100' },
          },
        },
      ],
      labels: {
        enabled: false,
      },
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
        name: 'NDVI',
        data: ndviData.parsedData,
        tooltip: {
          valueDecimals: 2,
          pointFormatter: function () {
            // let description = '';
            // if (this.y < 0) {
            //   description = 'Water bodies, clouds, snow';
            // } else if (this.y >= 0 && this.y < 0.1) {
            //   description = 'Bare soil, sand, rock';
            // } else if (this.y >= 0.2 && this.y < 0.5) {
            //   description = 'Shrubs, grasslands, sparse vegetation';
            // } else if (this.y >= 0.6 && this.y < 0.9) {
            //   description = 'Dense vegetation, forests, crops';
            // } else if (this.y >= 0.9 && this.y <= 1) {
            //   description = 'well-irrigated and healthy crops';
            // }
            return `<b>${this.series.name}</b>: ${this.y.toFixed(2)}<br/>`;
          },
        },
        color: '#0893ae',
        lineWidth: 1.5,
        marker: {
          enabled: false,
        },
      },
    ],
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // this is temporary for testing, user marker.id instead
        // const data = await getNdviData(8386);
        let data;
        if (plot) {
          data = await fetchMeanNDVI(plot, { accessToken });
        }
        if (point) {
          console.log('sending request for point', point);
          data = await fetchMeanNDVIForPoint(point, {
            accessToken,
          });
        }
        if (data) {
          setNdviData(parseNDVIData(data));
        }
      } catch (error) {
        console.log('Error fetching NDVI data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={ndviChartOptions} />
      <div className="flex items-center justify-between w-full gap-2 rounded-bl-md rounded-br-md bg-zinc-100 dark:bg-zinc-800 p-2 mt-0">
        <span className="flex gap-1">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            min:
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {ndviData.min}
            </span>
          </div>
        </span>
        <span className="flex gap-1">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            avg:
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {ndviData.average}
            </span>
          </div>
        </span>
        <span className="flex gap-1">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            max:
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {ndviData.max}
            </span>
          </div>
        </span>
      </div>
    </>
  );
};

export default NdviChart;
