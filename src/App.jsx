import 'maplibre-gl/dist/maplibre-gl.css';
import { MapProvider } from './contexts/MapContext';
import MyMap from './components/MyMap';
import { FullscreenControl } from 'react-map-gl/maplibre';
import { MarkersProvider } from './contexts/markersContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { PlotProvider } from './contexts/PlotContext';
{
  FullscreenControl;
}

function App() {
  return (
    <SettingsProvider>
      <MapProvider>
        <PlotProvider>
          <MarkersProvider>
            <div>
              <h1>Dashboard</h1>
            </div>
            <div style={{ padding: 30, marginTop: 20 }}>
              <MyMap />
            </div>
          </MarkersProvider>
        </PlotProvider>
      </MapProvider>
    </SettingsProvider>
  );
}

export default App;
