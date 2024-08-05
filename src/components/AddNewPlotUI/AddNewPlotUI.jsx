import { useContext, useEffect } from 'react';
import { MapContext } from '../../contexts/MapContext';
import PolygonDrawActionsPopup from '../PolygonDrawActionsPopup';

export default function AddNewPlotUI() {
  const { mapRef } = useContext(MapContext);
  const map = mapRef.current?.getMap();

  useEffect(() => {
    if (!map) return;
    map.on('draw.create', (event) => {
      console.log('draw create from addNewPlotUI. show add plot ui');
    });

    return () => {
      map.off('draw.create');
    };
  }, [map]);

  return <PolygonDrawActionsPopup />;
}
