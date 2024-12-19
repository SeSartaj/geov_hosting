import 'maplibre-gl/dist/maplibre-gl.css';
import { MapProvider } from './contexts/MapContext';
import MyMap from './components/MyMap';
import { MarkersProvider } from './contexts/markersContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { PlotProvider } from './contexts/PlotContext';
import { RasterLayerProvider } from './contexts/RasterLayerContext';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import ErrorBoundary from './components/ErrorBoundary';
import ConfirmContextProvider from './contexts/ConfirmContextProvider';
import DeleteDialog from './ui-components/DeleteDialog';

function App() {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <Provider theme={defaultTheme}>
        <SettingsProvider>
          <ConfirmContextProvider>
            <MapProvider>
              <RasterLayerProvider>
                <PlotProvider>
                  <MarkersProvider>
                    <div>
                      <h1>AGVMap Dashboard</h1>
                    </div>
                    <div style={{ padding: 30, marginTop: 20 }}>
                      <ErrorBoundary>
                        <MyMap />
                        <DeleteDialog />
                      </ErrorBoundary>
                    </div>
                  </MarkersProvider>
                </PlotProvider>
              </RasterLayerProvider>
            </MapProvider>
          </ConfirmContextProvider>
        </SettingsProvider>
      </Provider>
    </TooltipPrimitive.Provider>
  );
}

export default App;
