import { useContext, useEffect } from 'react';
import { PlotContext } from '../../contexts/PlotContext';
import { Source, Layer } from 'react-map-gl/maplibre';
import { MapContext } from '../../contexts/MapContext';
import { useMap } from 'react-map-gl';
import PlotPopup from '../PlotPopup';

export default function Plots() {
  const { plots, showPlots, clickedPlot, setClickedPlot } =
    useContext(PlotContext);
  const { drawRef, mapRef } = useContext(MapContext);
  const { current: map } = useMap();

  const plotLineStyle = {
    id: 'plots-line-layer',
    type: 'line',
    paint: {
      // 'fill-color': '#e31717', // Plot fill color
      // 'fill-opacity': 0.2,
      'line-color': '#e31717', // Plot outline color
      'line-width': 2, // Outline width set to 2px
    },
  };

  const plotFillStyle = {
    id: 'plots-layer',
    type: 'fill',
    paint: {
      'fill-color': '#e31717', // Plot fill color
      'fill-opacity': 0,
    },
  };

  const areFeaturesDrawn = (drawRef) => {
    const draw = drawRef?.current?.getAll();
    const features = draw?.features || [];
    return features.length > 0;
  };

  const handleMapClick = (event) => {
    // If there are any draw features, don't show the popup
    if (areFeaturesDrawn(drawRef)) {
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
  };

  const handleMouseEnter = () => {
    map.getCanvas().style.cursor = 'pointer';
  };

  const handleMouseLeave = () => {
    map.getCanvas().style.cursor = '';
  };

  const ndviLayerStyle = (plotId) => ({
    id: `ndvi-layer-${plotId}`,
    type: 'raster',
    source: `ndvi-source-${plotId}`,
    paint: {
      'raster-opacity': 0.7,
    },
  });

  useEffect(() => {
    if (map) {
      map.on('click', 'plots-layer', handleMapClick);
      map.on('mouseenter', 'plots-layer', handleMouseEnter);
      map.on('mouseleave', 'plots-layer', handleMouseLeave);
    }

    return () => {
      if (map) {
        map.off('click', 'plots-layer', handleMapClick);
        map.off('mouseenter', 'plots-layer', handleMouseEnter);
        map.off('mouseleave', 'plots-layer', handleMouseLeave);
      }
    };
  }, [map, showPlots]);

  if (!showPlots) return null;

  return (
    <>
      <Source
        id='plots'
        type='geojson'
        data={{ type: 'FeatureCollection', features: plots }}
      >
        <Layer {...plotLineStyle} />
        <Layer {...plotFillStyle} />
        {/* {plots.map((plot, index) => {
          const ndviUrl = plot.properties.ndviUrl;
          const bbox = plot.properties.bbox; // Assuming your plot has a bbox property

          // Check if ndviUrl and bbox are defined
          if (!ndviUrl || !bbox) {
            console.warn(`Plot ${index} is missing ndviUrl or bbox`);
            return null;
          }

          return (
            <Source
              key={plot.id}
              id={`ndvi-source-${plot.id}`}
              type='raster'
              tiles={[ndviUrl]} // NDVI URL from plot properties
              tileSize={256}
              // bounds={bbox} // Define the bounds to clip the NDVI to the plot boundary
            >
              <Layer
                // minzoom={12}
                // maxzoom={22}
                {...ndviLayerStyle(plot.id)}
                beforeId='plots-layer'
              />
            </Source>
          );
        })} */}
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
