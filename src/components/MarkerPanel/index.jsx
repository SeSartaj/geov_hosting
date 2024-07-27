import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import AddNewSourceModal from '../AddNewSourceModal';
import { BiTrash } from 'react-icons/bi';

export default function MarkerPanel() {
  const { mapRef } = useContext(MapContext);
  const map = mapRef.current.getMap();
  const [markers, setMarkers] = useState([
    {
      id: 'marker1',
      longitude: 69.2075,
      latitude: 34.5553,
      title: 'Marker 1',
      description: 'This is marker 1',
    },
    {
      id: 'marker2',
      longitude: 69.2075,
      latitude: 34.5553,
      title: 'Marker 2',
      description: 'This is marker 2',
    },
  ]);

  return (
    <div>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Markers</h3>
      </div>
      <hr />
    </div>
  );
}
