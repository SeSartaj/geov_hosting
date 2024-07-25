import { useContext, useState } from 'react';
import './styles.css';
import {
  BiCaretDown,
  BiCaretUp,
  BiHide,
  BiShow,
  BiTrash,
} from 'react-icons/bi';
import Tooltip from '../Tooltip';
import { MapContext } from '../../contexts/MapContext';
import turfBbox from '@turf/bbox';

function Layer({
  layers,
  layer,
  layerIndex,
  handleDeleteLayer,
  toggleLayerVisibility,
  setLayers,
}) {
  const { mapRef } = useContext(MapContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!layer) return null;

  const handleMoveLayer = (direction) => {
    const currentIndex = layerIndex;
    const newIndex = direction === 'up' ? currentIndex + 2 : currentIndex - 1;
    // get layer id for the newIndex
    if (newIndex < 0) return;
    if (newIndex >= layers.length) return;

    const beforeId = layers[newIndex]?.id;
    console.log('moving layer', newIndex, beforeId);
    mapRef?.current?.moveLayer(layer.id, beforeId);
    setLayers(mapRef?.current?.getStyle().layers);
  };

  const moveLayerUp = () => {
    console.log('moveLayerUp');
    handleMoveLayer('up');
  };

  const moveLayerDown = () => {
    console.log('moveLayerDown');
    handleMoveLayer('down');
  };

  const flyToLayer = (layerId) => {
    // Get the source data of the layer
    const sources = mapRef.current.getStyle().sources;
    console.log(sources);
    const sourceId = layer.source;
    const sourceData = sources[sourceId];
    console.log(sourceData);
    // Get the bbox of the source data

    if (sourceData.type === 'geojson' && sourceData.data.features.length > 0) {
      // Get the bounding box of the features in the layer
      const layerBbox = turfBbox(sourceData.data);

      // Fly to the bounding box of the layer
      mapRef.current.fitBounds(layerBbox, {
        padding: 20,
        duration: 2000, // Duration of the flight animation in milliseconds
      });
    } else {
      console.error('Layer is empty or not a FeatureCollection.');
    }
  };

  return (
    <div className='layer-container'>
      <div className='layer-header'>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
          }}
        >
          <Tooltip text='move layer above'>
            <BiCaretUp onClick={moveLayerUp} />
          </Tooltip>
          <Tooltip text='move layer below'>
            <BiCaretDown onClick={moveLayerDown} />
          </Tooltip>
        </span>
        <label onClick={toggleLayerVisibility}>
          {layer?.layout?.visibility === 'visible' ? (
            <Tooltip text='Hide Layer'>
              <BiShow className='action-icon' data-layer-id={layer.id} />
            </Tooltip>
          ) : (
            <Tooltip text='Show Layer'>
              <BiHide className='action-icon' data-layer-id={layer.id} />
            </Tooltip>
          )}
        </label>
      </div>
      <div className='layer-body'>
        <p onClick={flyToLayer}>{layer?.id}</p>
        {isExpanded && (
          <div>
            <span>
              {
                // get layer properties
                layer?.type
              }
            </span>
          </div>
        )}
      </div>
      <div className='layer-footer'>
        <span>
          <Tooltip text='delete layer'>
            <BiTrash
              className='action-icon'
              data-layer-id={layer.id}
              onClick={handleDeleteLayer}
            />
          </Tooltip>
          {isExpanded ? (
            <BiCaretUp className='action-icon' onClick={handleExpand} />
          ) : (
            <BiCaretDown className='action-icon' onClick={handleExpand} />
          )}
        </span>
      </div>
      {/* Add more layer-specific UI elements here */}
    </div>
  );
}

export default Layer;
