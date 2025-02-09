import 'maplibre-gl/dist/maplibre-gl.css';
import { MapProvider } from './contexts/MapContext';
import MyMap from './components/MyMap';
import { MarkersProvider } from './contexts/markersContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { PlotProvider } from './contexts/PlotContext';
import { RasterLayerProvider } from './contexts/RasterLayerContext';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import ErrorBoundary from './components/ErrorBoundary';
import ConfirmContextProvider from './contexts/ConfirmContextProvider';
import DeleteDialog from './ui-components/DeleteDialog';
import { ThemeProvider } from './contexts/ShadcnThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App({ style, requestHeaders, configs }) {
  return (
    <ThemeProvider defaultTheme="system">
      <TooltipPrimitive.Provider delayDuration={200}>
        <SettingsProvider>
          <ConfirmContextProvider>
            <MapProvider configs={configs}>
              <RasterLayerProvider>
                <PlotProvider>
                  <MarkersProvider>
                    <ErrorBoundary>
                      <MyMap
                        style={style}
                        requestHeaders={requestHeaders}
                        configs={configs}
                      />
                      <Toaster />
                      <DeleteDialog />
                    </ErrorBoundary>
                  </MarkersProvider>
                </PlotProvider>
              </RasterLayerProvider>
            </MapProvider>
          </ConfirmContextProvider>
        </SettingsProvider>
      </TooltipPrimitive.Provider>
    </ThemeProvider>
  );
}

export default App;
