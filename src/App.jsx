import 'maplibre-gl/dist/maplibre-gl.css';
import Sidebar from './components/Sidebar';
import { MapProvider } from './contexts/MapContext';
import MyMap from './components/MyMap';
import { FullscreenControl } from 'react-map-gl/maplibre';
import { MarkersProvider } from './contexts/markersContext';
{
  FullscreenControl;
}

function App() {
  return (
    <MapProvider>
      <MarkersProvider>
        <div>
          <h1>Dashboard</h1>
        </div>
        <div style={{ padding: 30, marginTop: 20 }}>
          <MyMap />
        </div>
      </MarkersProvider>
    </MapProvider>
  );
}

export default App;
