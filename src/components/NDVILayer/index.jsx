import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import AreaDetails from '../AreaDetails';
import { MapContext } from '@/contexts/MapContext';
import useMapStore from '@/stores/mapStore';

const WMTS_ID = import.meta.env.VITE_SENTINAL_HUB_WMTS_ID;
export const BASE_URL = `https://services.sentinel-hub.com/ogc/wmts/${WMTS_ID}?TILEMATRIXSET=PopularWebMercator256&Service=WMTS&Request=GetTile&RESOLUTION=10&MAXCC=20&TileMatrix={z}&TileCol={x}&TileRow={y}`;

function getLayerURL({ layer, dateRange }) {
  if (!layer || !dateRange) {
    return null;
  }
  // convert start and end to format to be sent with url
  const TIME = `${dateRange.start}/${dateRange.end}`;
  const url = `${BASE_URL}&LAYER=${layer}&TIME=${TIME}`;
  return url;
}

const NDVILayer = () => {
  const { opacity, dateRange, isVisible, datesLoading } =
    useContext(RasterLayerContext);

  const rasterLayer = useMapStore((state) => state.rasterLayer);
  const [url, setUrl] = useState(
    getLayerURL({ layer: rasterLayer.value, dateRange: dateRange })
  );
  const { mapInstance } = useContext(MapContext);
  const [beforeId, setBeforeId] = useState();

  // a function that checks if plots-layer exists on the map,
  // and then sets the beforeId to plots-layer, otherwise leave it empty
  const setBeforeIdIfPlotsLayerExists = useCallback(() => {
    if (!mapInstance) return;
    if (mapInstance.getLayer('plots-line-layer')) {
      console.log('plots-line-layer exists');
      setBeforeId('plots-line-layer');
    } else {
      setBeforeId();
    }
  }, [mapInstance, setBeforeId]);

  useEffect(() => {
    setBeforeIdIfPlotsLayerExists();
  }, [mapInstance, setBeforeIdIfPlotsLayerExists]);

  useEffect(() => {
    const u = getLayerURL({ layer: rasterLayer.value, dateRange: dateRange });
    setUrl(u);
  }, [rasterLayer, dateRange]);

  if (!isVisible || !url) {
    console.log('not rendering raster layer', isVisible, url);
    return null;
  }

  if (datesLoading) {
    console.log('dates are loading', url);
  }

  return (
    <>
      <Source
        id='raster-source'
        type='raster'
        tiles={[url]}
        tileSize={256}
        minzoom={10}
        maxzoom={21}
      >
        <Layer
          id='raster-layer'
          type='raster'
          source='raster-source'
          paint={{ 'raster-opacity': opacity / 100 }}
          beforeId={beforeId}
        />
      </Source>
      <AreaDetails />
    </>
  );
};

export default NDVILayer;
