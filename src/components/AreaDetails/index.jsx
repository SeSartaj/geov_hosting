import React, { useContext, useEffect, useState } from 'react';
import { MapContext } from '@/contexts/MapContext';
import { useMap } from 'react-map-gl/maplibre';
import * as Dialog from '@radix-ui/react-dialog';

export default function AreaDetails() {
  const { current: map } = useMap();
  const [details, setDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!map) return;

    const handleClick = (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['plots-layer'], // Replace with your actual layer ID
      });

      if (features.length > 0) {
        const plot = features[0];
        setDetails({
          coordinates: e.lngLat,
          plotDetails: plot.properties,
        });
        setIsOpen(true);
      } else {
        setDetails({
          coordinates: e.lngLat,
          plotDetails: null,
        });
        setIsOpen(true);
      }
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map]);

  console.log('running AreaDetials');

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button style={{ display: 'none' }}>Open Dialog</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
        <Dialog.Content className='fixed top-1/2 left-1/2 w-[300px] bg-white p-4 rounded-md shadow-md transform -translate-x-1/2 -translate-y-1/2'>
          <Dialog.Title>Area Details</Dialog.Title>
          <Dialog.Description>
            {details && (
              <div>
                <p>
                  Coordinates: {details.coordinates.lng},{' '}
                  {details.coordinates.lat}
                </p>
                {details.plotDetails ? (
                  <p>Plot Details: {JSON.stringify(details.plotDetails)}</p>
                ) : (
                  <p>No plot selected</p>
                )}
              </div>
            )}
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className='mt-4 bg-blue-500 text-white p-2 rounded'>
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
