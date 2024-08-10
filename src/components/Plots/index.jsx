import { useContext, useEffect, useState } from 'react';
import { PlotContext } from '../../contexts/PlotContext';
import { Source, Layer } from 'react-map-gl/maplibre';
import { MapContext } from '../../contexts/MapContext';
import { Popup } from 'react-map-gl/maplibre';
import { useMap } from 'react-map-gl';
import PlotPopup from '../PlotPopup';

export default function Plots() {
  const { plots } = useContext(PlotContext);
  const [popupInfo, setPopupInfo] = useState(null);
  const { current: map } = useMap();

  const layerStyle = {
    id: 'plots-layer',
    type: 'fill',
    paint: {
      'fill-color': '#0080ff', // Plot fill color
      'fill-opacity': 0.2,
    },
  };

  const handleMapClick = (event) => {
    console.log('inside handleMapClick');
    // Query for features from the draw layer
    const drawFeatures = map.queryRenderedFeatures(event.point, {
      layers: [
        'gl-draw-polygon-fill-inactive.cold',
        'gl-draw-polygon-fill-active',
      ],
    });

    // If there are any draw features, don't show the popup
    if (drawFeatures.length > 0) {
      setPopupInfo(null);
      return;
    }

    const features = map.queryRenderedFeatures(event.point, {
      layers: ['plots-layer'],
    });

    if (features.length > 0) {
      const clickedPlot = features[0];
      setPopupInfo({
        lngLat: event.lngLat,
        plot: clickedPlot, // Assuming the plot name is in the 'name' property
      });
    } else {
      setPopupInfo(null); // Hide popup if no plot is clicked
    }
  };

  const handleMouseEnter = () => {
    map.getCanvas().style.cursor = 'pointer';
  };

  const handleMouseLeave = () => {
    map.getCanvas().style.cursor = '';
  };

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
  }, [map]);

  return (
    <>
      <Source
        id='plots'
        type='geojson'
        data={{ type: 'FeatureCollection', features: plots }}
      >
        <Layer {...layerStyle} />
      </Source>
      {popupInfo && (
        <PlotPopup popupInfo={popupInfo} onClose={() => setPopupInfo(null)} />
      )}
    </>
  );
}
