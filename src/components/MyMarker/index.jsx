import React, { useMemo } from 'react';
import ForecastMarker from './ForecastMarker';
import StationMarker from './StationMarker';

function MyMarker(props) {
  console.log('forecast marker', props.marker.type);

  switch (props.marker.type) {
    case 'station':
      return <StationMarker {...props} />;
    case 'forecast':
      return <ForecastMarker {...props} />;
  }
}

const MemoizedMarker = React.memo(MyMarker);
export default MemoizedMarker;
