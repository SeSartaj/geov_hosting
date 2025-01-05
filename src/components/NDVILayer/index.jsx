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
  console.log('dateRange', dateRange);
  if (!layer || !dateRange || !dateRange?.start) {
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
    const url = `${layerOption.url}&TIME=${TIME}`;
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
    getLayerURL({ layer: rasterLayer.value, dateRange: { ...dateRange } })
  );
  const [beforeId, setBeforeId] = useState(null);
  const rasterOpacity = useMapStore((state) => state.rasterOpacity);
  const { current: mapInstance } = useMap();
  const map = mapInstance.getMap();

  // Update URL when layer or dateRange changes
  useEffect(() => {
    console.log('dateRange in useEffect layerUrl', dateRange);
    const u = getLayerURL({
      layer: rasterLayer.value,
      dateRange: { ...dateRange },
    });
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

  // handle layer order
  // const handleLayerOrder = useCallback(
  //   (e) => {
  //     console.log('handleLayerOrder', map.getLayersOrder());

  //     // Define the desired layer order
  //     // first ones are on top, last one at bottom
  //     const layerOrder = ['raster-layer', 'plots-line-layer'];

  //     // Check if all layers exist
  //     const allLayersExist = layerOrder.every((layerId) =>
  //       map.getLayer(layerId)
  //     );

  //     if (allLayersExist) {
  //       console.log('handleLayerOrder all layer exist', map.getLayersOrder());

  //       // Get the current layer order from the map
  //       const currentLayers = map.getStyle().layers.map((layer) => layer.id);

  //       // Check if the layers are in the correct order
  //       const isCorrectOrder = layerOrder.every((layerId, index) => {
  //         const currentIndex = currentLayers.indexOf(layerId);
  //         const expectedPreviousIndex =
  //           index === 0 ? -1 : currentLayers.indexOf(layerOrder[index - 1]);
  //         return currentIndex > expectedPreviousIndex;
  //       });

  //       if (isCorrectOrder) {
  //         console.log('handleLayerOrder Layer order is correct.');
  //       } else {
  //         try {
  //           console.log('handleLayerOrder Layer order is not correct.');

  //           // Iterate from top to bottom and ensure correct order
  //           layerOrder.slice().forEach((layerId, index) => {
  //             const nextLayer = layerOrder[layerOrder.length - index - 2]; // Get the next layer
  //             try {
  //               if (nextLayer) {
  //                 map.moveLayer(layerId, nextLayer); // Place current layer above the next one
  //               } else {
  //                 map.moveLayer(layerId); // Place on top if no next layer
  //               }
  //             } catch (error) {
  //               console.error(`Error reordering layer ${layerId}:`, error);
  //             }
  //           });

  //           console.log(
  //             'Updated layer order:',
  //             map.getStyle().layers.map((l) => l.id)
  //           );
  //         } catch (error) {
  //           console.error('Error reordering layers:', error);
  //         }
  //       }
  //     } else {
  //       console.warn('One or more layers in the list do not exist on the map.');
  //     }
  //   },
  //   [mapInstance]
  // );

  const handleLayerOrder = useCallback(
    (e) => {
      console.log('handleLayerOrder');
      if (map.getLayer('plots-line-layer') && map.getLayer('raster-layer')) {
        const layers = map.getLayersOrder();

        // if plots-line-layer was below raster-layer
        if (
          layers.indexOf('plots-line-layer') < layers.indexOf('raster-layer')
        ) {
          console.log('reordering layers');
          map.moveLayer('raster-layer', 'plots-line-layer');
        }
      }
    },
    [mapInstance]
  );

  useEffect(() => {
    if (map) {
      map.on('styledata', handleLayerOrder);
    }

    return () => {
      if (map) {
        map.off('styledata', handleLayerOrder);
      }
    };
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
