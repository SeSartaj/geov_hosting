import useMapStore from '@/stores/mapStore';
import Spinner from '@/ui-components/Spinner';
import { useEffect, useState } from 'react';

export default function PlotStatisticsGraph({ getData }) {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(null);
  //   get all required data fro the getData

  useEffect(() => {
    if (getData) {
      getData()
        .then((data) => {
          console.log('Fetched data ddd:', data);
          setData(data?.features[0]?.properties);
          setDate(data?.datetime);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [getData]);

  if (!data) {
    return <Spinner />;
  }

  return (
    <div>
      <h1>Plot Statistics for date {new Date(date).toLocaleDateString()}</h1>

      <div className="flex items-center justify-between w-full gap-2 rounded-bl-md rounded-br-md bg-zinc-100 dark:bg-zinc-800 p-2 mt-0">
        <span className="flex gap-1">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            min:
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {data?.min}
            </span>
          </div>
        </span>
        <span className="flex gap-1">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            max:
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {data?.max}
            </span>
          </div>
        </span>
        <span className="flex gap-1">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            avg:
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {data.avg}
            </span>
          </div>
        </span>
        <span className="flex gap-1">
          <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
            stddev:
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {data.stddev}
            </span>
          </div>
        </span>
      </div>
    </div>
  );
}
