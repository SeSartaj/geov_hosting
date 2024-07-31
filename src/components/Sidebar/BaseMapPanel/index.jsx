import { useContext, useState } from 'react';
import { MapContext } from '../../../contexts/MapContext';
import AddNewStyleModal from '../../AddNewStyleModal';
import './styles.css';
import MapStyleSwitcher from './MapStyleSwitcher';

export default function BaseMapPanel() {
  const { mapRef } = useContext(MapContext);
  const map = mapRef.current.getMap();

  return (
    <div>
      <span className='panel-header-action'>
        <h3>Base Map</h3>
        {/* <AddNewStyleModal /> */}
        {/* <p>
          show available styles here so user can switch between them store all
          map settings in a single context which in the future can be fetched
          from backend so each user&apos;s preference are remembered.
          </p> */}
      </span>
      <hr />
      <MapStyleSwitcher />
    </div>
  );
}
