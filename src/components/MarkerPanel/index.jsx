import { useContext } from 'react';
import AddNewMarkerModal from '../AddNewMarkerModal';
import { MarkersContext } from '../../contexts/markersContext';
import './styles.css';

export default function MarkerPanel() {
  const { markersData } = useContext(MarkersContext);

  return (
    <div className='panel-container'>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Markers</h3>
        <AddNewMarkerModal />
      </div>

      <hr />
      <div className='panel-content'>
        {markersData?.map((marker) => (
          <div key={marker.id} className='marker-item'>
            <div className='marker-item-info'>
              <h4>{marker.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
