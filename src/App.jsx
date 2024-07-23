import 'maplibre-gl/dist/maplibre-gl.css';
import Sidebar from './components/Sidebar';
import { MapContext, MapProvider } from './contexts/MapContext';
import MyMap from './components/MyMap';

function App() {
  return (
    <MapProvider>
      <MyMap />
      <Sidebar />
    </MapProvider>
  );
}

export default App;
