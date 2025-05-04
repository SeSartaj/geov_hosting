import useMapStore from '@/stores/mapStore';
import Spinner from '@/ui-components/Spinner';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ETTimeseriesChart } from '../PlotNDVIChart';

export default function PlotStatisticsGraph({ getData }) {
  const passDates = useMapStore((s) => s.passDates);

  // get the time series for the past 4 months
  const nintyDaysAgo = new Date();
  nintyDaysAgo.setDate(nintyDaysAgo.getDate() - 120);
  nintyDaysAgo.setHours(0, 0, 0, 0); // Normalize to start of day

  const timeSeriesDates = passDates
    .map((date) => {
      // Handle multiple date formats
      if (date instanceof Date) return date;
      if (typeof date === 'string' || typeof date === 'number') {
        return new Date(date);
      }
      return null;
    })
    .filter((date) => {
      // Validate the date and check range
      return date instanceof Date && !isNaN(date) && date >= nintyDaysAgo;
    });

  console.log('mmm series dates', passDates, timeSeriesDates);

  const [data, setData] = useState(null);
  const [date, setDate] = useState(null);
  //   get all required data fro the getData

  useEffect(() => {
    if (getData && timeSeriesDates.length > 0) {
      // Create an array of promises for each date
      const dataPromises = timeSeriesDates.map((date) =>
        getData({ startDate: date, endDate: date }) // Assuming getData expects an object with startDate
          .then((response) => ({
            data: response?.features[0]?.properties,
            date: response?.datetime,
          }))
          .catch((error) => {
            console.error(`Error fetching data for date ${date}:`, error);
            return null; // Return null for failed requests
          })
      );

      // Execute all requests in parallel
      Promise.all(dataPromises)
        .then((results) => {
          // Filter out any failed requests (null values)
          const successfulResults = results.filter((result) => result !== null);

          const dataForChart = successfulResults.map((result) => ({
            x: new Date(result.date).getTime(),
            y: result.data.avg,
            min: result.data.min,
            max: result.data.max,
            stddev: result.data.stddev,
          }));

          setData(dataForChart);
          console.log(
            'mmm succcsssfulResults',
            successfulResults,
            dataForChart
          );
        })
        .catch((error) => {
          console.error('Error in one or more requests:', error);
        });
    }
  }, [getData, passDates]);

  if (!data) {
    return <Spinner />;
  }

  return (
    <div>
      <ETTimeseriesChart data={data} />
      {/* <div className="flex items-center justify-between w-full gap-2 rounded-bl-md rounded-br-md bg-zinc-100 dark:bg-zinc-800 p-2 mt-0">
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
      </div> */}
    </div>
  );
}
