import { useContext, useState } from 'react';
import { MapContext } from '../../../contexts/MapContext';
import AddNewStyleModal from '../../AddNewStyleModal';
import './styles.css';
import MapStyleSwitcher from './MapStyleSwitcher';

export default function BaseMapPanel() {
  const { mapRef } = useContext(MapContext);
  const map = mapRef.current.getMap();

  return (
    <div className="panel-container">
      <span className="panel-header-action">
        <h3 className="text-lg">Base Map</h3>
        {/* <AddNewStyleModal /> */}
        {/* <p>
          show available styles here so user can switch between them store all
          map settings in a single context which in the future can be fetched
          from backend so each user&apos;s preference are remembered.
          </p> */}
      </span>
      <hr className="my-2" />
      <MapStyleSwitcher />
    </div>
  );
}
