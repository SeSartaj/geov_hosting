import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PlotContext } from '../../contexts/PlotContext';
import { Source, Layer } from 'react-map-gl/maplibre';
import { MapContext } from '../../contexts/MapContext';
import { useMap } from 'react-map-gl/maplibre';
import PlotPopup from '../PlotPopup';

import { getCroppedRaster } from '@/utils/fetchNDVIFromProcessingAPI';
import { bbox } from '@turf/turf';
import debounce from '@/utils/debounce';
import isEmptyObject from '@/utils/isEmptyObject';
import useMapStore, { VIEW_MODES } from '@/stores/mapStore';
import { AccessTokenContext } from '@/contexts/AccessTokenProvider';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';

export default function Plots() {
  const {
    plots,
    showPlots,
    clickedPlot,
    setClickedPlot,
    weeksBefore,
    showNdviLayer,
  } = useContext(PlotContext);

  const showCroppedImages = useMapStore((s) => s.showCroppedImages);

  // the selected layer from options
  const rasterLayer = useMapStore((state) => state.rasterLayer);

  const { isVisible, setIsVisible, dateRange } = useContext(RasterLayerContext);

  const setCursor = useMapStore((state) => state.setCursor);
  const resetCursor = useMapStore((state) => state.resetCursor);
  const { drawRef, mapRef } = useContext(MapContext);
  const accessToken = useContext(AccessTokenContext);
  const map = mapRef?.current?.getMap();
  const viewMode = useMapStore((state) => state.viewMode);
  const addLoadingNDVIImage = useMapStore((state) => state.addLoadingNDVIImage);
  const removeLoadingNDVIImage = useMapStore(
    (state) => state.removeLoadingNDVIImage
  );

  // rename this later to isCroppedImageLoading
  const isNDVIImageLoading = useMapStore((state) => state.isNDVIImageLoading);
  const setShowCroppedImages = useMapStore((s) => s.setShowCroppedImages);

  const addCroppedRasterLayerToMap = useCallback(
    (imageUrl, plot, { map }) => {
      console.log('crop adding image to map', imageUrl, plot, map);
      if (!map) throw new Error('map is not defined');
      // if layer is toggled off, don't add image to map
      if (!showCroppedImages) return null;

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
      const sourceId = `croppedImageSource-${plot.properties.id}`;
      const layerId = `croppedImageLayer-${plot.properties.id}`;

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
    [showCroppedImages]
  );

  const handleCroppedImageDownload = useCallback(
    async (
      plot,
      { accessToken, map, timeTravel, dateRange, isVisible, showCroppedImages }
    ) => {
      console.log('handleCroppedImageDownload started');
      // clone the plot object to avoid mutating the original object
      console.log('crop download plot', plot);
      if (!map) throw new Error('map is not defined');

      // Check if the  layer for this plot is already added to the map
      const layerId = `croppedImageLayer-${plot.properties.id}`;
      console.log('crop visible, showCropped', isVisible, showCroppedImages);
      if (!isVisible || !showCroppedImages) {
        console.log(
          'crop either isVisible or not plot mode selected, deleting layer and returning'
        );

        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        return;
      }

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

        // when daterange is js Date, convert it to string
        if (dateRange.start instanceof Date) {
          dateRange.start = dateRange.start.toISOString().split('T')[0];
        }
        if (dateRange.end instanceof Date) {
          dateRange.end = dateRange.end.toISOString().split('T')[0];
        }
        const ndviDataUrl = await getCroppedRaster(plot, {
          rasterLayer: rasterLayer,
          dateRange: dateRange,
          accessToken: accessToken,
        });

        if (!plot) throw new Error('plot is not defined');
        console.log('mapp', map);

        if (ndviDataUrl) {
          console.log();
          addCroppedRasterLayerToMap(ndviDataUrl, plot, { map });
        }
      } catch (error) {
        console.log('error in loading ndvi layer');
      } finally {
        removeLoadingNDVIImage(plot.properties.id);
      }
      // Add the image to the map
    },
    [
      rasterLayer,
      isNDVIImageLoading,
      addLoadingNDVIImage,
      addCroppedRasterLayerToMap,
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
        console.log('clickedPlot', clickedPlot);

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
    setCursor('pointer');
  }, [setCursor, map]);

  const handleMouseLeave = useCallback(() => {
    resetCursor();
  }, [setCursor, map]);

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
      console.log('handleViewportChange start');

      if (!map || viewMode !== 'NORMAL') {
        return;
      }

      const zoom = map.getZoom();
      if (zoom < 10) return; // Early exit if zoom is too low

      const bounds = map.getBounds();

      plots.forEach((plot) => {
        if (isEmptyObject(plot.options)) return; // Skip plots without geometry

        const plotBounds = bbox(plot.options);
        if (isBoundingBoxIntersecting(plotBounds, bounds)) {
          handleCroppedImageDownload(plot.options, {
            dateRange,
            accessToken,
            map,
            timeTravel,
            isVisible,
            showCroppedImages,
          });
        }
      });

      console.log('handleViewportChange end');
    },
    [
      map,
      plots,
      accessToken,
      dateRange,
      isBoundingBoxIntersecting,
      viewMode,
      isVisible,
      showCroppedImages,
      rasterLayer,
    ]
  );

  // Use useMemo to prevent unnecessary re-creations
  const debouncedHandleViewportChange = useMemo(
    () => debounce(handleViewportChange, 500),
    [handleViewportChange]
  );

  // run the code when date changes or the visibily changes
  useEffect(() => {
    console.log('dateRnage changed, crop');
    handleViewportChange({ timeTravel: true });
  }, [dateRange, isVisible, showCroppedImages, plots, rasterLayer]);

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

  useEffect(() => {
    console.log('running useEffect inside plots');

    if (!map || viewMode !== 'NORMAL' || !showNdviLayer || !showPlots) return;

    console.log('adding viewport change event to map');
    map.on('moveend', debouncedHandleViewportChange);
    map.on('zoomend', debouncedHandleViewportChange);

    return () => {
      console.log('removing viewport change event from map');
      debouncedHandleViewportChange.cancel();
      map.off('moveend', debouncedHandleViewportChange);
      map.off('zoomend', debouncedHandleViewportChange);
    };
  }, [map, showPlots, viewMode, showNdviLayer, debouncedHandleViewportChange]);

  // when hovered on a plot, change cursor to pointer
  useEffect(() => {
    if (map && viewMode !== 'PICKER') {
      map.on('mouseenter', 'plots-layer', handleMouseEnter);
      map.on('mouseleave', 'plots-layer', handleMouseLeave);
    }

    return () => {
      if (map && viewMode !== 'PICKER') {
        map.off('mouseenter', 'plots-layer', handleMouseEnter);
        map.off('mouseleave', 'plots-layer', handleMouseLeave);
      }
    };
  }, [map, handleMouseEnter, handleMouseLeave, viewMode]);

  if (!showPlots) return null;

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

      {clickedPlot && viewMode == VIEW_MODES.NORMAL && (
        <PlotPopup
          popupInfo={clickedPlot}
          onClose={() => setClickedPlot(null)}
        />
      )}
    </>
  );
}
