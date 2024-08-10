import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
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
  const [ndviData, setNdviData] = useState(transformedNdviData);
  const [loading, setLoading] = useState(false);

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

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default NdviChart;
