import ForecastMarker from './ForecastMarker';
import StationMarker from './StationMarker';

export default function MyMarker({ marker, ...rest }) {
  console.log('forecast marker', marker.type);

  switch (marker.type) {
    case 'station':
      return <StationMarker marker={marker} {...rest} />;
    case 'forecast':
      return <ForecastMarker marker={marker} {...rest} />;
  }
}
