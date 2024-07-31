import 'maplibre-gl/dist/maplibre-gl.css';
import { MapProvider } from './contexts/MapContext';
import MyMap from './components/MyMap';
import { FullscreenControl } from 'react-map-gl/maplibre';
import { MarkersProvider } from './contexts/markersContext';
import { SettingsProvider } from './contexts/SettingsContext';
{
  FullscreenControl;
}

function App() {
  return (
    <SettingsProvider>
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
    </SettingsProvider>
  );
}

export default App;
