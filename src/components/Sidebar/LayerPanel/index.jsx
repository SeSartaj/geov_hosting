import { useState, useContext } from 'react';
import { MapContext } from '../../../contexts/MapContext';
import { BiTrash } from 'react-icons/bi';
import AddNewLayerModal from '../../AddNewLayer';
import AddNewSourceModal from '../../AddNewSourceModal';
import Layer from '../../Layer';

export default function LayerPanel() {
  const { mapRef } = useContext(MapContext);
  const map = mapRef.current.getMap();
  const [sources, setSources] = useState(map?.getStyle()?.sources || []);
  const [layers, setLayers] = useState(map.getStyle().layers);

  const handleRemoveSource = (e) => {
    const sourceId = e.target.getAttribute('data-source-id');
    if (sourceId) {
      map?.removeSource(sourceId);
      setSources(map.getStyle().sources);
    }
  };

  const toggleLayerVisibility = (e) => {
    const layerId = e.target.getAttribute('data-layer-id');
    // check if layer exists
    if (!map?.getLayer(layerId)) {
      return;
    }
    // get current visilibyt
    const currentVisibility = mapRef.current.getLayoutProperty(
      layerId,
      'visibility'
    );
    if (currentVisibility === 'visible') {
      map?.setLayoutProperty(layerId, 'visibility', 'none');
    } else {
      map?.setLayoutProperty(layerId, 'visibility', 'visible');
    }
    setLayers(map.getStyle().layers);
  };

  const handleDeleteLayer = (e) => {
    const layerId = e.target.getAttribute('data-layer-id');
    if (layerId) {
      map?.removeLayer(layerId);
      setLayers(map.getStyle().layers);
    }
  };

  return (
    <div>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Map Layers</h3>
        <AddNewLayerModal />
      </div>
      <hr />
      <ul
        className='layers-list'
        style={{ overflowY: 'scroll', height: '60vh', paddingRight: 10 }}
      >
        {layers
          .map((layer, i) => (
            <Layer
              layers={layers}
              layerIndex={i}
              layer={layer}
              handleDeleteLayer={handleDeleteLayer}
              toggleLayerVisibility={toggleLayerVisibility}
              key={layer.id}
              setLayers={setLayers}
            />
          ))
          .reverse()}
      </ul>
    </div>
  );
}
