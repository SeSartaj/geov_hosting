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

function Layer({ layer, handleDeleteLayer, toggleLayerVisibility }) {
  const { mapRef } = useContext(MapContext);
  const [opacity, setOpacity] = useState(1);
  const [blendMode, setBlendMode] = useState('normal');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!layer) return null;

  return (
    <div className='layer-container'>
      <div className='layer-header'>
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
