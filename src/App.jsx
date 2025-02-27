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
import { IntlProvider } from 'react-intl';

function App({ style, requestHeaders, configs, markers }) {
  return (
    <IntlProvider>
      <ThemeProvider defaultTheme="light">
        <TooltipPrimitive.Provider delayDuration={200}>
          <SettingsProvider>
            <ConfirmContextProvider>
              <MapProvider configs={configs}>
                <RasterLayerProvider>
                  <PlotProvider>
                    <MarkersProvider providedMarkers={markers}>
                      <ErrorBoundary>
                        <MyMap
                          style={style}
                          requestHeaders={requestHeaders}
                          configs={configs}
                        />
                        <Toaster richColors />
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
    </IntlProvider>
  );
}

export default App;
