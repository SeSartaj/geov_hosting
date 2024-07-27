import 'maplibre-gl/dist/maplibre-gl.css';
import Sidebar from './components/Sidebar';
import { MapProvider } from './contexts/MapContext';
import MyMap from './components/MyMap';
import { FullscreenControl } from 'react-map-gl';
{
  FullscreenControl;
}

function App() {
  return (
    <MapProvider>
      <div style={{ padding: 30, marginTop: 20 }}>
        <MyMap>
          <FullscreenControl position='top-right' />
          <Sidebar />
        </MyMap>
      </div>
    </MapProvider>
  );
}

export default App;
