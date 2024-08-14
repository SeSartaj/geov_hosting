import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { usePlots } from '../hooks/usePlots';

// Create a new context for the map
const PlotContext = createContext();

const PlotProvider = ({ children }) => {
  const [clickedPlot, setClickedPlot] = useState(null);
  const { plots, loading, addNewPlot, updatePlot } = usePlots();
  const [showPlots, setShowPlots] = useState(true);
  useEffect(() => {
    console.log('plots have changed, updating the context', plots, loading);
  }, [plots, loading]);

  const handleShowPlots = (value) => {
    setClickedPlot(null);
    setShowPlots(value);
  };

  return (
    <PlotContext.Provider
      value={{
        plots,
        addNewPlot,
        updatePlot,
        clickedPlot,
        setClickedPlot,
        showPlots,
        setShowPlots: handleShowPlots,
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
