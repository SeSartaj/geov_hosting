import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import AreaDetails from '../AreaDetails';
import { MapContext } from '@/contexts/MapContext';
import useMapStore from '@/stores/mapStore';
import getBottomMostLayer from '@/utils/getBottomMostLayer';
import { useMap } from 'react-map-gl/maplibre';
import { layerOptions } from '@/constants';

const WMTS_ID = import.meta.env.VITE_SENTINAL_HUB_WMTS_ID;
export const BASE_URL = `https://services.sentinel-hub.com/ogc/wmts/${WMTS_ID}?TILEMATRIXSET=PopularWebMercator256&Service=WMTS&Request=GetTile&RESOLUTION=10&MAXCC=20&TileMatrix={z}&TileCol={x}&TileRow={y}&FORMAT=image/png`;

function getLayerURL({ layer, dateRange }) {
  if (!layer || !dateRange) {
    return null;
  }

  // when daterange is js Date, convert it to string
  if (dateRange.start instanceof Date) {
    dateRange.start = dateRange.start.toISOString().split('T')[0];
  }
  if (dateRange.end instanceof Date) {
    dateRange.end = dateRange.end.toISOString().split('T')[0];
  }

  // convert start and end to format to be sent with url
  const TIME = `${dateRange.start}/${dateRange.end}`;
  const layerOption = layerOptions.find((l) => l.value === layer);

  if (layerOption && layerOption?.url) {
    const url = `${layerOption.url}&TIME=2024-11-23`;
    return url;
  }
  const url = `${BASE_URL}&LAYER=${layer}&TIME=${TIME}`;

  return url;
}

const NDVILayer = () => {
  const { dateRange, isVisible } = useContext(RasterLayerContext);

  // the selected layer from options
  const rasterLayer = useMapStore((state) => state.rasterLayer);

  const [url, setUrl] = useState(
    getLayerURL({ layer: rasterLayer.value, dateRange: dateRange })
  );
  const [beforeId, setBeforeId] = useState(null);
  const rasterOpacity = useMapStore((state) => state.rasterOpacity);
  const { current: mapInstance } = useMap();
  // Update URL when layer or dateRange changes
  useEffect(() => {
    const u = getLayerURL({ layer: rasterLayer.value, dateRange: dateRange });
    setUrl(u);
  }, [rasterLayer, dateRange]);

  // Set beforeId based on the presence of plots-layer
  useEffect(() => {
    console.log('map is', mapInstance);
    console.log('map is', mapInstance?.loaded());
    if (
      mapInstance &&
      mapInstance?.loaded() &&
      mapInstance.getLayer('plots-line-layer')
    ) {
      setBeforeId('plots-line-layer');
    } else {
      setBeforeId(null); // No 'beforeId' if plots-layer doesn't exist
    }
  }, [mapInstance]);

  if (!isVisible || !url) {
    return null;
  }

  return (
    <>
      <Source
        id="raster-source"
        type="raster"
        tiles={[url]}
        tileSize={256}
        minzoom={10}
        maxzoom={21}
      >
        <Layer
          id="raster-layer"
          type="raster"
          source="raster-source"
          paint={{ 'raster-opacity': rasterOpacity / 100 }}
          beforeId={beforeId || undefined} // Only apply if beforeId exists
        />
      </Source>
      <AreaDetails />
    </>
  );
};

export default NDVILayer;
