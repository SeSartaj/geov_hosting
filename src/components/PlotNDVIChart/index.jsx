import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { BiLoader } from 'react-icons/bi';
import { fetchMeanNDVI } from '@/api/sentinalHubApi';

function parseNDVIData(data) {
  if (!data) return;
  if (!data.length > 0) return;

  return data.map((entry) => {
    return {
      x: new Date(entry.interval.from).getTime(), // Convert date to timestamp
      y: entry.outputs.data.bands.B0.stats.mean, // Extract mean NDVI value
    };
  });
}

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
  const [loading, setLoading] = useState(true);

  const options = {
    chart: {
      type: 'line',
      height: 100,
    },
    title: {
      text: null, // No title
    },
    xAxis: {
      categories: ndviData.map((d) => new Date(d.time).toLocaleDateString()),
      tickLength: 0, // Hide ticks
      labels: {
        enabled: false, // Hide labels
      },
    },
    yAxis: {
      min: -1,
      max: 1,
      title: {
        text: null, // No title
      },
      gridLineWidth: 0, // Remove horizontal grid lines
      lineWidth: 0, // Remove the axis line itself
      plotBands: [
        {
          from: -1,
          to: 0,
          color: 'rgba(0, 0, 255, 0.3)', // Blue
        },
        {
          from: 0,
          to: 0.2,
          color: 'rgba(165, 42, 42, 0.3)', // Brown
        },
        {
          from: 0.2,
          to: 0.5,
          color: 'rgba(144, 238, 144, 0.3)', // Light green
        },
        {
          from: 0.5,
          to: 1,
          color: 'rgba(0, 128, 0, 0.3)', // Green
        },
      ],
      labels: {
        enabled: false,
      },
    },
    tooltip: {
      formatter: function () {
        return `Date: ${this.x}<br>NDVI: ${this.y}`;
      },
    },
    series: [
      {
        name: 'NDVI',
        data: ndviData.map((d) => d.ndvi),
        color: '#333',
        lineWidth: 1,
        marker: {
          enabled: false, // Hide dots
        },
      },
    ],
    credits: {
      enabled: false, // Disable the Highcharts watermark
    },
    legend: {
      enabled: false, // Disable the legend
    },
  };
  const ndviChartOptions = {
    chart: {
      type: 'line',
      margin: [0, 0, 0, 0], // Remove margins
      height: 120, // Adjust height to reduce the size of the chart
    },
    title: {
      text: '', // Remove the chart title
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: null, // Remove x-axis title
      },
    },
    yAxis: {
      title: {
        text: null, // Remove y-axis title
      },
      min: 0,
      max: 1,
    },
    series: [
      {
        name: 'NDVI',
        data: parseNDVIData(ndviData),
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // this is temporary for testing, user marker.id instead
        // const data = await getNdviData(8386);

        const data = await fetchMeanNDVI(plot);
        console.log('ndvi data', ndviData);
        if (data) {
          setNdviData(data);
        }
      } catch (error) {
        console.log('Error fetching NDVI data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <BiLoader />;

  return <HighchartsReact highcharts={Highcharts} options={ndviChartOptions} />;
};

export default NdviChart;
