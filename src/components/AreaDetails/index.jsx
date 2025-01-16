import GeoTIFF from 'geotiff';

import React, { useContext, useEffect, useState } from 'react';
// import * as Tabs from '@radix-ui/react-tabs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { MapContext } from '@/contexts/MapContext';
import MyModal from '@/ui-components/MyModal';
import NdviChart from '../PlotNDVIChart';
import { TabContent, TabTrigger } from '@/ui-components/Tabs';
import { FaRegMap } from 'react-icons/fa6';
import { HiOutlineMapPin } from 'react-icons/hi2';
import useMapStore from '@/stores/mapStore';
import { ET_BASE_URL } from '@/constants';
import { Button } from '../ui/button';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import Spinner from '@/ui-components/Spinner';

export default function AreaDetails() {
  const { mapRef } = useContext(MapContext);
  const pickerData = useMapStore((state) => state.pickerData);
  const setPickerData = useMapStore((state) => state.setPickerData);
  const rasterLayer = useMapStore((state) => state.rasterLayer);
  const [pointEtValue, setPointEtValue] = useState(null);
  const { dateRange } = useContext(RasterLayerContext);
  const [loading, setLoading] = useState(false);

  function getValueAtPointWCS(e) {
    setLoading(true);
    const coordinates = pickerData.coordinates;
    // get x,y and map size
    const map = mapRef.current.getMap();
    const bbox = map.getBounds();
    const point = map.project(coordinates);
    const canvas = map.getCanvas();
    const size = {
      width: canvas.width,
      height: canvas.height,
    };

    // Construct the bounding box string
    const bboxString = [
      bbox.getWest(),
      bbox.getSouth(),
      bbox.getEast(),
      bbox.getNorth(),
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
      width: size.width,
      height: size.height,
      srs: 'EPSG:4326',
      time: dateRange.start.toISOString().split('T')[0],
      info_format: 'application/json',
      x: Math.floor(point.x),
      y: Math.floor(point.y),
    });

    // Construct the URL with parameters
    const url = `${baseURL}?${params.toString()}`;

    // Fetch the data from the GeoServer
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Received coverage data for point:', coordinates);
        console.log('Data:', data, typeof data);
        if (data?.features?.length > 0) {
          console.log(data?.features[0]?.properties?.GRAY_INDEX);
          setPointEtValue(data?.features[0]?.properties?.GRAY_INDEX);
        }
        // TODO: Implement or use a library to read the TIFF and get the exact value at the point.

        // For now, we return a placeholder:
        return 'Data processing not implemented. Received binary data.';
      })
      .catch((error) => {
        console.error(
          'There was a problem with the fetch operation:',
          error.message
        );
        return null; // Or handle the error as needed
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (pickerData && rasterLayer.value === 'ET') {
      getValueAtPointWCS();
    }
  }, [pickerData, rasterLayer, dateRange]);

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
              tooltipText="Point"
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
            {loading ? (
              <Spinner />
            ) : (
              pointEtValue && (
                <h3 className="text-lg p-2">
                  ET value at this point is: {pointEtValue.toFixed(3)}
                </h3>
              )
            )}
          </TabContent>
          {pickerData?.plot && (
            <TabContent value="plot">
              <NdviChart plot={pickerData.plot} />
            </TabContent>
          )}
        </Tabs>
      </MyModal>
    </>
  );
}
