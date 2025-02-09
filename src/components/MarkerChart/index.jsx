import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

import { getPawData } from '../../api/markerApi';
import { BiLoader } from 'react-icons/bi';
import Spinner from '@/ui-components/Spinner';


const HumidityChart = ({ marker }) => {
  const [pawData, setPawData] = useState([]);
  const [loading, setLoading] = useState(true);

  const PAW_BANDS = [
    {
        from: 1,
        to: 30,
        color: 'rgba(255,179,186,.3)'
    }, {
        from: 30,
        to: 70,
        color: 'rgba(255,255,186,.3)'
    }, {
        from: 70,
        to: 100,
        color: 'rgba(186,255,201,.3)'
    }, {
        from: 100,
        to: 200,
        color: 'rgba(110,192,255,.3)'
    }
]

  const hichartOptions = {

    time: {
      timezone: 'UTC'
  },
  chart: {
      backgroundColor: null,
      borderWidth: 0,
      type: 'line',
      margin: [10, 0, 5, 0],
      height: 90,
      style: {
          overflow: 'visible'
      },
      skipClone: true
  },
  title: {
      text: ''
  },
  credits: {
      enabled: false
  },
  xAxis: {
      labels: {
          enabled: false
      },
      title: {
          text: null
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
          enabled: false
      },
      title: {
          text: null
      },
      tickPositions: [0]
  },
  legend: {
      enabled: false
  },
  tooltip: {
      hideDelay: 0,
      outside: true,
      shared: true,
      pointFormat: `<b>{point.y}</b>`
  },
  plotOptions: {
      series: {
          animation: false,
          lineWidth: 1,
          shadow: false,
          states: {
              hover: {
                  lineWidth: 1
              }
          },
          marker: {
              radius: 1,
              states: {
                  hover: {
                      radius: 2
                  }
              }
          },
          fillOpacity: 0.25
      },
      column: {
          negativeColor: '#910000',
          borderColor: 'silver'
      }
  },

  series: [{
      data: pawData
  }]
  };



  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        // this is temporary for testing, user marker.id instead
        const data = await getPawData(marker?.id);
        setPawData(data);
      } catch (error) {
        console.log('error fetching paw data');
      } finally {
        setLoading(false);
      }
    };

    fetchdata();
  }, [marker]);

  if (loading) return <Spinner />;

  return <HighchartsReact   highcharts={Highcharts} options={hichartOptions} />;
};

export default HumidityChart;
