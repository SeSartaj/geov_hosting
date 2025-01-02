import { useCallback, useContext, useEffect, useState } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import './mapbox-draw-style.css';
import './styles.css';
import DrawActionsPopup from '../DrawActionsPopup';
import { useControl, useMap } from 'react-map-gl/maplibre';
import { MapContext } from '../../contexts/MapContext';
import useMapStore from '@/stores/mapStore';
import { VIEW_MODES } from '@/stores/mapStore';
import { FaPlantWilt } from 'react-icons/fa6';
import { Button } from '../ui/button';
import ActionsPopup from '../ActionsPopup';
import { PlotContext } from '@/contexts/PlotContext';
import { Save, Trash, XIcon } from 'lucide-react';
import AddPlotModal from '../AddPlotModal';
import AddNewMarkerModal from '../AddNewMarkerModal';
import Tooltip from '@/ui-components/Tooltip';

export function AddStationControl() {
  const [features, setFeatures] = useState({});
  const setViewMode = useMapStore((state) => state.setViewMode);
  const viewMode = useMapStore((state) => state.viewMode);
  const [drawMode, setDrawMode] = useState();
  const [plotShape, setPlotShape] = useState({});

  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const { drawRef, showDrawActionPopup, setShowDrawActionPopup } =
    useContext(MapContext);

  const draw = drawRef.current;

  const { current: mapRef } = useMap();

  useEffect(() => {
    draw.changeMode('draw_point');
  }, [draw]);

  const handleDeleteFeature = () => {
    if (draw) {
      draw.delete(plotShape.id);
    }
    setViewMode(VIEW_MODES.NORMAL);
  };

  const handleModeChange = (e) => {
    console.log('mode changed', e.mode);
    // when everything is cleared, set mode to view
    setDrawMode(e.mode);
  };

  const handleSelectionChange = (e) => {
    // what if more than one feature is selected? where will the
    // popup be displayed?
    // when feature is deleted, the popup should disappear
    console.log('selection changed', e);
    // print all drawn features to consule
    const selected = drawRef.current.getSelected();
    setSelectedFeatures(selected);
  };

  const handlePlotShapeChange = useCallback((event) => {
    console.log('running plot shape change', event.features);
    // if editing a plot
    console.log('handling draw change', event);
    // Update the plot when it is edited
    if (event.features && event.features.length > 0) {
      setPlotShape(event.features[0]);
    }
  }, []);

  useEffect(() => {
    console.log('shape changed', plotShape);
  }, [plotShape]);

  const handleEditCancel = () => {
    draw.deleteAll();
    setViewMode(VIEW_MODES.NORMAL);
  };

  const handleTrashClick = () => {
    const selectedFeatures = draw.getSelectedIds();
    draw.trash();
  };

  useEffect(() => {
    const mapInstance = mapRef.getMap();
    mapInstance.on('draw.modechange', handleModeChange);
    mapInstance.on('draw.selectionchange', handleSelectionChange);

    return () => {
      mapInstance.off('draw.modechange', handleModeChange);
      mapInstance.off('draw.selectionchange', handleSelectionChange);
    };
  }, [drawRef]);

  // when plot shape is edited
  useEffect(() => {
    if (map && draw) {
      // Listen to draw.update event for edits
      // when shape is changed, store it in a stta
      mapRef.on('draw.create', handlePlotShapeChange);
      mapRef.on('draw.update', handlePlotShapeChange);
      // mapRef.on('draw.modechange', handleDrawComplete);

      // Clean up the event listeners when the component unmounts
      return () => {
        mapRef.off('draw.create', handlePlotShapeChange);
        mapRef.off('draw.update', handlePlotShapeChange);

        // mapRef.off('draw.modechange', handleDrawComplete);
      };
    }
  }, [mapRef, draw, handlePlotShapeChange]);

  return (
    <>
      <div className="absolute bottom-0 right-0  pb-8 p-3  z-2 flex justify-end align-bottom gap-2">
        <Button variant="outline" size="icon" onClick={handleEditCancel}>
          <XIcon />
        </Button>
        <Button variant="outline" size="icon" onClick={handleTrashClick}>
          <Trash />
        </Button>
        {/* a control on the right side of the screen with three bottoms top of each other */}
        <AddNewMarkerModal
          trigger={
            <Button variant="outline" size="icon">
              <Tooltip text="add station">
                <Save />
              </Tooltip>
            </Button>
          }
          feature={plotShape}
          deleteFeature={handleDeleteFeature}
        />
      </div>
    </>
  );

  return null;
}
