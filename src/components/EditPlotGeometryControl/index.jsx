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

export function EditPlotGeometryControl() {
  const [features, setFeatures] = useState({});
  const setViewMode = useMapStore((state) => state.setViewMode);
  const viewMode = useMapStore((state) => state.viewMode);
  const [drawMode, setDrawMode] = useState();
  const { editingPlot, handlePlotUpdate } = useContext(PlotContext);
  const [plotShape, setPlotShape] = useState(editingPlot?.options);

  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const { drawRef, showDrawActionPopup, setShowDrawActionPopup } =
    useContext(MapContext);

  const draw = drawRef.current;

  const { current: mapRef } = useMap();

  const constants = MapboxDraw.constants;

  // Set the custom classes for MapLibre
  constants.classes.CONTROL_BASE = 'maplibregl-ctrl';
  constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-';
  constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group';

  const onCreate = useCallback((e) => {
    console.log('onCreate');
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onUpdate = onCreate;

  const onDelete = useCallback((e) => {
    // when editing plot
    if (viewMode in [VIEW_MODES.EDIT_PLOT, VIEW_MODES.EDIT_MARKER]) {
      setViewMode(VIEW_MODES.NORMAL);
    }
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  const handleDrawComplete = (event) => {
    console.log('event features', event.features);
    console.log('editing plot', editingPlot);
    if (plotShape) {
      handlePlotUpdate({ ...editingPlot, options: plotShape })
        .then(() => {
          console.log('mode', event.mode);
          // delete draws after completion
          draw.deleteAll();
          setViewMode(VIEW_MODES.NORMAL);
        })
        .catch((error) => {
          console.error('error updating plot', error);
        });
    }
  };

  useEffect(() => {
    console.log('editingPlot changed', editingPlot);
  }, [editingPlot]);

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

  const handlePlotShapeChange = useCallback(
    (event) => {
      // if editing a plot
      console.log('handling draw change', event);
      // Update the plot when it is edited
      if (event.features && event.features.length > 0) {
        setPlotShape(event.features[0]);
        // handlePlotUpdate({ ...editingPlot, options: event.features[0] });
      }
    },
    [editingPlot, handlePlotUpdate]
  );

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
      mapRef.on('draw.update', handlePlotShapeChange);
      // mapRef.on('draw.modechange', handleDrawComplete);

      // Clean up the event listeners when the component unmounts
      return () => {
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
        <Button size="icon" onClick={handleDrawComplete}>
          <Save />
        </Button>
      </div>
    </>
  );

  return null;
}
