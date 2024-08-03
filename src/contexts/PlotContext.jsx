import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { usePlots } from '../hooks/usePlots';

// Create a new context for the map
const PlotContext = createContext();

const PlotProvider = ({ children }) => {
  const [clickedPlot, setClickedPlot] = useState(null);
  const { plots, loading, addNewPlot } = usePlots();

  useEffect(() => {
    console.log('plots have changed, updating the context', plots, loading);
  }, [plots, loading]);

  return (
    <PlotContext.Provider
      value={{
        plots,
        addNewPlot,
        clickedPlot,
        setClickedPlot,
      }}
    >
      {children}
    </PlotContext.Provider>
  );
};

PlotProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { PlotContext, PlotProvider };
