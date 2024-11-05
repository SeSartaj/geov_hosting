import { useCallback, useContext, useEffect, useState } from 'react';
import { PlotContext } from '../../contexts/PlotContext';
import { Source, Layer } from 'react-map-gl/maplibre';
import { MapContext } from '../../contexts/MapContext';
import { useMap } from 'react-map-gl/maplibre';
import PlotPopup from '../PlotPopup';
import useAccessToken from '@/hooks/useAccessToken';
import fetchNDVIImage from '@/utils/fetchNDVIFromProcessingAPI';
import { bbox } from '@turf/turf';
import debounce from '@/utils/debounce';
import isEmptyObject from '@/utils/isEmptyObject';
import useMapStore from '@/stores/mapStore';

export default function Plots() {
  const {
    plots,
    showPlots,
    clickedPlot,
    setClickedPlot,
    weeksBefore,
    showNdviLayer,
  } = useContext(PlotContext);

  const setCursor = useMapStore((state) => state.setCursor);
  const resetCursor = useMapStore((state) => state.resetCursor);
  const { drawRef, mapRef } = useContext(MapContext);
  const accessToken = useAccessToken();
  const map = mapRef?.current?.getMap();
  const viewMode = useMapStore((state) => state.viewMode);
  const addLoadingNDVIImage = useMapStore((state) => state.addLoadingNDVIImage);
  const removeLoadingNDVIImage = useMapStore(
    (state) => state.removeLoadingNDVIImage
  );
  const isNDVIImageLoading = useMapStore((state) => state.isNDVIImageLoading);

  const addNDVIImageToMap = useCallback(
    (imageUrl, plot, { map }) => {
      if (!map) throw new Error('map is not defined');
      // if layer is toggled off, don't add image to map
      if (!showNdviLayer) return null;
      console.log('plotss', plot);
      if (!plot || !plot.geometry || plot.geometry.type !== 'Polygon')
        return null;

      // const { geometry } = plot;

      // Calculate the bounding box [minX, minY, maxX, maxY]
      const [minX, minY, maxX, maxY] = bbox(plot.geometry);

      // Define the bounds of the image as the four corners of the bounding box
      const bounds = [
        [minX, maxY], // top-left corner
        [maxX, maxY], // top-right corner
        [maxX, minY], // bottom-right corner
        [minX, minY], // bottom-left corner
      ];
      // Check if the source and layer with the same id already exist
      const sourceId = `ndviImageSource-${plot.properties.id}`;
      const layerId = `ndviImageLayer-${plot.properties.id}`;

      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }

      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      // Add the image as a raster layer
      map.addSource(sourceId, {
        type: 'image',
        url: imageUrl,
        coordinates: bounds,
      });

      map.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
        paint: {
          'raster-opacity': 1,
        },
      });
    },
    [showNdviLayer]
  );

  const handleNDVIImageDownload = useCallback(
    async (plot, { accessToken, map, timeTravel }) => {
      // clone the plot object to avoid mutating the original object
      if (!map) throw new Error('map is not defined');

      // Check if the ndvi layer for this plot is already added to the map
      const layerId = `ndviImageLayer-${plot.properties.id}`;

      if (map.getLayer(layerId)) {
        if (timeTravel) {
          console.log('only time travel');
          map.removeLayer(layerId);
        } else {
          console.log('NDVI layer already added for this plot', layerId);
          return;
        }
      }
      try {
        // if the plot is already loading, return
        if (isNDVIImageLoading(plot.properties.id)) return;
        addLoadingNDVIImage(plot.properties.id);
        const ndviDataUrl = await fetchNDVIImage(plot, {
          weeksBefore: weeksBefore,
          accessToken: accessToken,
        });

        if (!plot) throw new Error('plot is not defined');
        console.log('mapp', map);

        if (ndviDataUrl) {
          addNDVIImageToMap(ndviDataUrl, plot, { map });
        }
      } catch (error) {
        console.log('error in loading ndvi layer');
      } finally {
        removeLoadingNDVIImage(plot.properties.id);
      }
      // Add the image to the map
    },
    [
      weeksBefore,
      addNDVIImageToMap,
      isNDVIImageLoading,
      addLoadingNDVIImage,
      removeLoadingNDVIImage,
    ]
  );

  const plotLineStyle = {
    id: 'plots-line-layer',
    type: 'line',
    paint: {
      'line-color': '#e31717',
      'line-width': 2,
    },
  };

  const plotFillStyle = {
    id: 'plots-layer',
    type: 'fill',
    paint: {
      'fill-color': '#e31717',
      'fill-opacity': 0,
    },
  };

  const areFeaturesDrawn = useCallback(() => {
    const draw = drawRef?.current?.getAll();
    const features = draw?.features || [];
    return features.length > 0;
  }, [drawRef]);

  const handleMapClick = useCallback(
    (event) => {
      // If there are any draw features, don't show the popup
      if (areFeaturesDrawn()) {
        console.log('no popup info');
        setClickedPlot(null);
        return;
      }

      const features = map.queryRenderedFeatures(event.point, {
        layers: ['plots-layer'],
      });

      if (features.length > 0) {
        const clickedPlot = features[0];
        setClickedPlot({
          lngLat: event.lngLat,
          plot: clickedPlot, // Assuming the plot name is in the 'name' property
        });
      } else {
        setClickedPlot(null); // Hide popup if no plot is clicked
      }
    },
    [areFeaturesDrawn, map, setClickedPlot]
  );

  const handleMouseEnter = useCallback(() => {
    console.log('entering plot area');
    map.getCanvas().style.cursor = 'pointer';
  }, [setCursor]);

  const handleMouseLeave = useCallback(() => {
    console.log('leaving plot area');
    // resetCursor();
    map.getCanvas().style.cursor = 'grab';
  }, [setCursor]);

  const isBoundingBoxIntersecting = useCallback((plotBounds, mapBounds) => {
    const [minX, minY, maxX, maxY] = plotBounds;
    const [[mapMinX, mapMinY], [mapMaxX, mapMaxY]] = mapBounds.toArray();

    // Check for intersection
    return !(
      minX > mapMaxX ||
      maxX < mapMinX ||
      minY > mapMaxY ||
      maxY < mapMinY
    );
  }, []);

  const handleViewportChange = useCallback(
    ({ timeTravel = false }) => {
      if (!map) return;
      // if layer is not turned on, don't fetch the images
      if (!showNdviLayer) return;
      // if not normal mode, don't downlaod image
      if (viewMode !== 'NORMAL') return;
      // Get the current zoom level
      const zoom = map.getZoom();

      // Check if the zoom level is within the desired range
      const zoomLevelThreshold = 10;
      if (zoom >= zoomLevelThreshold) {
        const bounds = map.getBounds();

        // Check for each plot if it's visible in the current map view
        plots.forEach((plot) => {
          // if plot has no geomtry, don't try to download NDVI image
          if (isEmptyObject(plot.options)) return null;
          const plotBounds = bbox(plot?.options); // Get bounding box of the plot

          // Check if the plot's bounding box intersects with the map's bounds
          if (isBoundingBoxIntersecting(plotBounds, bounds)) {
            // Call the function to download and add NDVI image
            handleNDVIImageDownload(plot?.options, {
              accessToken,
              map,
              timeTravel,
            });
          }
        });
      }
    },
    [
      map,
      plots,
      accessToken,
      handleNDVIImageDownload,
      isBoundingBoxIntersecting,
      showNdviLayer,
      viewMode,
    ]
  );

  const handleTimeTravel = useCallback(() => {
    handleViewportChange({ timeTravel: true });
  }, [handleViewportChange]);

  useEffect(() => {
    const debouncedHandleViewportChange = debounce(handleTimeTravel, 500);
    debouncedHandleViewportChange();
    return () => {
      debouncedHandleViewportChange.cancel();
    };
  }, [weeksBefore, handleTimeTravel]);

  // when clicked on plot, show popup
  useEffect(() => {
    if (map && showPlots && viewMode !== 'PICKER') {
      map.on('click', 'plots-layer', handleMapClick);
    }
    return () => {
      if (map) {
        map.off('click', 'plots-layer', handleMapClick);
      }
    };
  }, [handleMapClick, viewMode, showPlots, map]);

  // if plot within view, download the ndvi image from processing API
  useEffect(() => {
    console.log('runnign useEffect inside plots');
    if (map && viewMode === 'NORMAL' && showNdviLayer && showPlots) {
      console.log('adding viewPortchange event to map');
      map.on('moveend', handleViewportChange);
      map.on('zoomend', handleViewportChange);
    }

    return () => {
      console.log('adding removing viewPortchange event from map');
      if (map) {
        map.off('moveend', handleViewportChange);
        map.off('zoomend', handleViewportChange);
      }
    };
  }, [
    map,
    showPlots,
    viewMode,
    handleMapClick,
    handleViewportChange,
    showNdviLayer,
  ]);

  // when hovered on a plot, change cursor to pointer
  useEffect(() => {
    if (map) {
      map.on('mouseenter', 'plots-layer', handleMouseEnter);
      map.on('mouseleave', 'plots-layer', handleMouseLeave);
    }

    return () => {
      if (map) {
        map.off('mouseenter', 'plots-layer', handleMouseEnter);
        map.off('mouseleave', 'plots-layer', handleMouseLeave);
      }
    };
  }, [map, handleMouseEnter, handleMouseLeave]);

  if (!showPlots) return null;

  console.log('adding Plots to map');

  return (
    <>
      <Source
        id="plots"
        type="geojson"
        data={{
          type: 'FeatureCollection',
          features: plots.map((p) => p?.options),
        }}
      >
        <Layer key="12kkd" {...plotLineStyle} />
        <Layer key="12kmsn" {...plotFillStyle} />
      </Source>

      {clickedPlot && (
        <PlotPopup
          popupInfo={clickedPlot}
          onClose={() => setClickedPlot(null)}
        />
      )}
    </>
  );
}
