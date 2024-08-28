import 'maplibre-gl/dist/maplibre-gl.css';
import { MapProvider } from './contexts/MapContext';
import MyMap from './components/MyMap';
import { MarkersProvider } from './contexts/markersContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { PlotProvider } from './contexts/PlotContext';
import { AccessTokenProvider } from './contexts/AccessTokenProvider';
import { RasterLayerProvider } from './contexts/RasterLayerContext';

function App() {
  return (
    <AccessTokenProvider>
      <SettingsProvider>
        <MapProvider>
          <RasterLayerProvider>
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
          </RasterLayerProvider>
        </MapProvider>
      </SettingsProvider>
    </AccessTokenProvider>
  );
}

export default App;
