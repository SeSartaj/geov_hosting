import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchMeanNDVI, fetchMeanNDVIForPoint } from '@/api/sentinalHubApi';
import Spinner from '@/ui-components/Spinner';
import useAccessToken from '@/hooks/useAccessToken';

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

const NdviChart = ({ plot, point }) => {
  const [ndviData, setNdviData] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = useAccessToken();

  const ndviChartOptions = {
    chart: {
      type: 'line',
      margin: [0, 0, 0, 0],
      height: 120,
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: null,
      },
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
        },
        {
          from: 0,
          to: 0.1,
          color: 'rgba(165, 42, 42, 0.3)', // Brown
        },
        {
          from: 0.2,
          to: 0.5,
          color: 'rgba(144, 238, 144, 0.3)', // Light green
        },
        {
          from: 0.6,
          to: 0.9,
          color: 'rgba(0, 128, 0, 0.3)', // Green
        },
        {
          from: 0.9,
          to: 1,
          color: 'rgba(34, 139, 34, 0.3)', // Darker green
        },
      ],
      labels: {
        enabled: false,
      },
    },
    series: [
      {
        name: 'NDVI',
        data: parseNDVIData(ndviData),
        tooltip: {
          valueDecimals: 2,
          pointFormatter: function () {
            let description = '';
            if (this.y < 0) {
              description = 'Water bodies, clouds, snow';
            } else if (this.y >= 0 && this.y < 0.1) {
              description = 'Bare soil, sand, rock';
            } else if (this.y >= 0.2 && this.y < 0.5) {
              description = 'Shrubs, grasslands, sparse vegetation';
            } else if (this.y >= 0.6 && this.y < 0.9) {
              description = 'Dense vegetation, forests, crops';
            } else if (this.y >= 0.9 && this.y <= 1) {
              description = 'well-irrigated and healthy crops';
            }
            return `<b>${this.series.name}</b>: ${this.y.toFixed(
              2
            )}<br/>${description}`;
          },
        },
        color: '#333',
        lineWidth: 1,
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

  if (loading) return <Spinner />;

  return <HighchartsReact highcharts={Highcharts} options={ndviChartOptions} />;
};

export default NdviChart;
