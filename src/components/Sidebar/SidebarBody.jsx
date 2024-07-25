import { useContext, useEffect, useState } from 'react';
import Navigation from './Navigation';
import { MapContext } from '../../contexts/MapContext';

export default function SidebarBody() {
  const { mapRef } = useContext(MapContext);
  const [isLoading, setIsLoading] = useState(false);
  const stopLoading = () => {
    console.log('stoped loading');
    setIsLoading(false);
  };

  const startLoading = () => {
    console.log('started loading');
    setIsLoading(true);
  };

  useEffect(() => {
    console.log('adding  listeners');

    mapRef.current.on('load', stopLoading);
    mapRef.current.on('render', startLoading);

    return () => {
      console.log('removing listeners');
      mapRef.current.off('load', stopLoading);
      mapRef.current.off('render', startLoading);
    };
  }, []);

  return (
    <div>
      <h1 style={{ margin: 0 }}>
        GEOVis
        {isLoading && 'loading...'}
      </h1>

      {/* <NavBar /> */}
      <Navigation />
    </div>
  );
}
