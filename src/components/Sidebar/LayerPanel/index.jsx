import { useState, useContext, useEffect } from 'react';
import { MapContext } from '../../../contexts/MapContext';
import { BiHide, BiShow, BiTrash } from 'react-icons/bi';
import AddNewLayerModal from '../../AddNewLayer';
import AddNewSourceModal from '../../AddNewSourceModal';

export default function LayerPanel() {
  const { mapRef } = useContext(MapContext);
  const map = mapRef.current.getMap();
  const [sources, setSources] = useState(map?.getStyle()?.sources || []);

  const handleRemoveSource = (e) => {
    const sourceId = e.target.getAttribute('data-source-id');
    if (sourceId) {
      map?.removeSource(sourceId);
      setSources(map.getStyle().sources);
    }
  };

  return (
    <div>
      <h3>Sources</h3>
      <AddNewSourceModal setSources={setSources} />

      <ul>
        {Object.keys(sources).map((source) => (
          <li key={source}>
            {source}
            <BiTrash data-source-id={source} onClick={handleRemoveSource} />
          </li>
        ))}
      </ul>

      <h3>Map Layers</h3>
      <AddNewLayerModal />
      <hr />
    </div>
  );
}
