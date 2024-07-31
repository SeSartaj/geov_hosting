import { useState } from 'react';
import Navigation from './Navigation';
import './styles.css';

export default function SidebarBody() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className='sidebar-body'>
      <h1 style={{ margin: 0 }}>
        GEOVis
        {isLoading && 'loading...'}
      </h1>

      <Navigation />
    </div>
  );
}
