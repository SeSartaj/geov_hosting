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
          <BiCaretUp onClick={moveLayerUp} />
          <BiCaretDown onClick={moveLayerDown} />
        </span>
        <label onClick={toggleLayerVisibility}>
          {mapRef?.current?.getLayoutProperty(layer.id, 'visibility') ===
          'visible' ? (
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
        <p>{layer?.id}</p>
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
