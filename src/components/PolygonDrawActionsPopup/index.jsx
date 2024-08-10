import React, { useContext, useState } from 'react';
import MyButton from '../../ui-components/MyButton';
import { PlotContext } from '../../contexts/PlotContext';
import { Popup } from 'react-map-gl/maplibre';
import AddPlotModal from '../AddPlotModal';

export default function PolygonDrawActionsPopup({ polygon }) {
  if (!polygon) return null;

  console.log('popup is rendering');

  return (
    <Popup
      latitude={polygon.geometry.coordinates[0][0][1]}
      longitude={polygon.geometry.coordinates[0][0][0]}
      closeOnClick={false}
      anchor='top'
    >
      <AddPlotModal polygon={polygon} />
    </Popup>
  );
}
