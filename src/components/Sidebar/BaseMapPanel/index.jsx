import { useContext, useState } from 'react';
import { MapContext } from '../../../contexts/MapContext';
import AddNewStyleModal from '../../AddNewStyleModal';
import { BiHide, BiShow, BiTrash } from 'react-icons/bi';
import Layer from '../../Layer';

export default function BaseMapPanel() {
  const { mapRef } = useContext(MapContext);
  const map = mapRef.current.getMap();
  const [layers, setLayers] = useState(map.getStyle().layers);

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
      <span>
        <h3>Base Map</h3>
        <AddNewStyleModal />
      </span>

      {/* <h3>Select Style</h3>
      <ul>
        <li>Map style 1</li>
        <li>Map style 2</li>
        <li>Map style 3</li>
      </ul> */}
      <h3>Map Layers</h3>

      <ul style={{ listStyleType: 'none' }}>
        {layers.map((layer) => (
          <Layer
            layer={layer}
            key={layer.id}
            handleDeleteLayer={handleDeleteLayer}
            toggleLayerVisibility={toggleLayerVisibility}
          />

          // <li key={layer.id}>
          //   <span
          //     style={{ cursor: 'pointer' }}
          //     onClick={() => toggleLayerVisibility(layer.id)}
          //   >
          //     {mapRef?.current?.getLayoutProperty(layer.id, 'visibility') ===
          //     'visible' ? (
          //       <BiShow />
          //     ) : (
          //       <BiHide />
          //     )}
          //   </span>{' '}
          //   {layer.id}
          //   {
          //     <BiTrash
          //       style={{ cursor: 'pointer' }}
          //       data-layer-id={layer.id}
          //       onClick={handleDeleteLayer}
          //     />
          //   }
          // </li>
        ))}
      </ul>
    </div>
  );
}
