import { useContext, useEffect, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import AddNewSourceModal from '../AddNewSourceModal';
import { BiTrash } from 'react-icons/bi';
import { Marker, Popup } from 'react-map-gl/maplibre';

export default function MarkerPanel() {
  const { mapRef } = useContext(MapContext);
  const mapInstance = mapRef.current.getMap();
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

  useEffect(() => {
    mapInstance.on('load', () => {
      console.log('loading markers');
      markers.forEach((marker) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(https://placekitten.com/50/50)';
        el.style.width = '50px';
        el.style.height = '50px';

        new Marker(el)
          .setLngLat([marker.longitude, marker.latitude])
          .setPopup(
            new Popup().setHTML(
              `<h3>${marker.title}</h3><p>${marker.description}</p>`
            )
          )
          .addTo(mapInstance);
      });
    });

    // cleanup
    return () => {
      mapInstance.off('load', () => {
        // remove all markers
        markers.forEach((marker) => {
          mapInstance.removeLayer(marker.id);
        });
      });
    };
  }, [markers, mapRef]);

  console.log('markers');

  return (
    <div>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Markers</h3>
      </div>
      <hr />
    </div>
  );
}
