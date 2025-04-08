import GeoTIFF from 'geotiff';

import React, { useContext, useEffect, useState } from 'react';
// import * as Tabs from '@radix-ui/react-tabs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { MapContext } from '@/contexts/MapContext';
import MyModal from '@/ui-components/MyModal';
import NdviChart, { ETTimeseriesChart } from '../PlotNDVIChart';
import { TabContent, TabTrigger } from '@/ui-components/Tabs';
import { FaRegMap } from 'react-icons/fa6';
import { HiOutlineMapPin } from 'react-icons/hi2';
import useMapStore from '@/stores/mapStore';
import { ET_BASE_URL } from '@/constants';
import { Button } from '../ui/button';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import Spinner from '@/ui-components/Spinner';
import { getETTimeSeriesData } from '@/lib/utils';

export default function AreaDetails() {
  const pickerData = useMapStore((state) => state.pickerData);
  const setPickerData = useMapStore((state) => state.setPickerData);
  const rasterLayer = useMapStore((state) => state.rasterLayer);
  const [pointEtValue, setPointEtValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const dateRange = pickerData?.dateRange;

  console.log('inside area details picker', dateRange);
  function getValueAtPointWCS(pickerData) {
    console.log('getting value');
    setLoading(true);
    setPointEtValue(null);
    setLoadingError(null);
    const coordinates = pickerData.coordinates;
    // get x,y and map size

    console.log('coordinates are', coordinates);

    const buffer = 0.000001;
    // Construct the bounding box string
    const bboxString = [
      coordinates.lng - buffer,
      coordinates.lat - buffer,
      coordinates.lng + buffer,
      coordinates.lat + buffer,
    ].join(',');

    // GeoServer WCS endpoint URL template
    const baseURL = 'https://d27s6pvwcjpmsu.cloudfront.net/geoserver/ne/wms';

    // Parameters for WCS GetCoverage request
    const params = new URLSearchParams({
      service: 'WMS',
      version: '1.1.1',
      request: 'GetFeatureInfo',
      layers: 'ne:et_data',
      query_layers: 'ne:et_data',
      bbox: bboxString,
      width: 1,
      height: 1,
      srs: 'EPSG:4326',
      time: dateRange?.start?.toISOString()?.split('T')[0] || undefined,
      info_format: 'application/json',
      x: 0,
      y: 0,
    });

    // Construct the URL with parameters
    const url = `${baseURL}?${params.toString()}`;

    // Fetch the data from the GeoServer
    return fetch(url)
      .then((response) => {
        console.log('response is', response);
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        return response.json();
      })
      .then((data) => {
        console.log('Received coverage data for point:', data);
        console.log('Data:', data, typeof data);
        if (data?.features?.length > 0) {
          console.log('Value is', data?.features[0]?.properties?.GRAY_INDEX);
          setPointEtValue(data?.features[0]?.properties?.GRAY_INDEX);
        }
      })
      .catch((error) => {
        console.error(
          'There was a problem with the fetch operation:',
          error.message
        );
        setPointEtValue(undefined);
        setLoadingError('could not load ET value at point');
        return null; // Or handle the error as needed
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    console.log('pickerData', pickerData);
    if (pickerData && rasterLayer.value === 'ET') {
      getValueAtPointWCS(pickerData);
    }
  }, [pickerData, rasterLayer]);

  useEffect(() => {
    if (pickerData && rasterLayer.value === 'ET') {
      getValueAtPointWCS(pickerData);
    }
  }, [dateRange]);

  if (!pickerData) {
    return null;
  }

  return (
    <>
      <MyModal
        open={true}
        setOpen={() => setPickerData(null)}
        title="Area Details"
        headerClassName="m-4"
      >
        <Tabs
          className="flex flex-col w-full h-full overflow-y-hidden"
          defaultValue="point"
        >
          <TabsList
            className="grid w-full grid-cols-2"
            aria-label="Manage your account"
          >
            <TabsTrigger
              value="point"
              // portalContainer={mapInstance.getContainer()}
            >
              <HiOutlineMapPin className="cursor-pointer" /> &nbsp;
              <span>Point</span>
            </TabsTrigger>
            {pickerData?.plot && (
              <TabsTrigger value="plot" tooltipText="Plot">
                <FaRegMap className="cursor-pointer" />
                &nbsp;
                <span>Plot</span>
              </TabsTrigger>
            )}
          </TabsList>
          <br />

          <TabContent value="point">
            {rasterLayer.value === '3_NDVI' && (
              <NdviChart point={pickerData.coordinates} />
            )}
            {rasterLayer.value === 'ET' && (
              <ETTimeseriesChart
                getData={() =>
                  getETTimeSeriesData({ coordinates: pickerData?.coordinates })
                }
              />
            )}
            {/* {loading ? (
              <Spinner />
            ) : loadingError ? (
              <div className="text-red ">Could not load ET value</div>
            ) : (
              pointEtValue && (
                <div className="flex items-center  justify-between w-full gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800 p-2 ">
                  <h4 className="scroll-m-20 text-xs font-medium tracking-tight">
                    ET value at this point (
                    {pickerData.dateRange.start.toISOString().split('T')[0]})
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-700 dark:text-gray-200 font-bold">
                      {pointEtValue.toFixed(3)}
                    </span>
                  </div>
                </div>
              )
            )} */}
          </TabContent>
          {pickerData?.plot && (
            <TabContent value="plot">
              {rasterLayer.value === '3_NDVI' && (
                <NdviChart plot={pickerData.plot} />
              )}
              {rasterLayer.value === 'ET' && (
                <ETTimeseriesChart
                  getData={() =>
                    getETTimeSeriesData({ plot: pickerData?.plot })
                  }
                />
              )}
            </TabContent>
          )}
        </Tabs>
      </MyModal>
    </>
  );
}
