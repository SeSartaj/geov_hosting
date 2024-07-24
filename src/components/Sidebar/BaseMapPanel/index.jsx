import { useContext, useState } from 'react';
import { MapContext } from '../../../contexts/MapContext';
import AddNewStyleModal from '../../AddNewStyleModal';
import './styles.css';

export default function BaseMapPanel() {
  const { mapRef } = useContext(MapContext);
  const map = mapRef.current.getMap();

  return (
    <div>
      <span>
        <h3>Base Map</h3>
        <AddNewStyleModal />
      </span>
    </div>
  );
}
