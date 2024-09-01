import { MapContext } from '@/contexts/MapContext';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import { bbox } from '@turf/turf';
import { get } from 'immutable';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import AreaDetails from '../AreaDetails';
import CustomControlButton from '../CustomControl';
import { BiCrosshair } from 'react-icons/bi';

export const BASE_URL =
  'https://services.sentinel-hub.com/ogc/wmts/89900a2e-d05a-4e89-9fb5-76d00c8b9919?TILEMATRIXSET=PopularWebMercator256&Service=WMTS&Request=GetTile&RESOLUTION=10&MAXCC=20&TileMatrix={z}&TileCol={x}&TileRow={y}';

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
  const {
    layer,
    opacity,
    dateRange,
    isVisible,
    isDetailActive,
    handleStateChange,
  } = useContext(RasterLayerContext);

  const url = getLayerURL({ layer: layer.value, dateRange: dateRange });

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <Source
        id='raster-source'
        type='raster'
        tiles={[url]}
        tileSize={256}
        minzoom={10}
        maxzoom={20}
      >
        <Layer
          id='raster-layer'
          type='raster'
          source='raster-source'
          paint={{ 'raster-opacity': opacity / 100 }}
          // beforeId='plots-layer'
        />
      </Source>
      <AreaDetails />
      <CustomControlButton
        label='Toggle Detail View'
        Icon={<BiCrosshair size={24} className='maplibregl-ctrl-icon' />}
        onClick={({ buttonRef }) => {
          handleStateChange(!isDetailActive);
          if (buttonRef?.current) {
            console.log(buttonRef.current.classList);
            if (isDetailActive) {
              buttonRef.current.classList.add('active');
            } else {
              buttonRef.current.classList.remove('active');
            }
          }
        }}
      />
    </>
  );
};

export default NDVILayer;
