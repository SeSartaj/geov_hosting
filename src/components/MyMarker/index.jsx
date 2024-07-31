import ForecastMarker from './ForecastMarker';
import StationMarker from './StationMarker';

export default function MyMarker({ marker, ...rest }) {
  switch (marker.properties.marker.type) {
    case 'station':
      return <StationMarker marker={marker} {...rest} />;
    case 'forecast':
      return <ForecastMarker marker={marker} {...rest} />;
  }
}
