import { useContext, useDebugValue, useEffect, useState } from 'react';
import { PlotContext } from '../../contexts/PlotContext';
import { calculatePolygonArea } from '../../utils/calculatePolygonArea';
import { squareMetersToAcres } from '../../utils/squareMetersToAcres';
import { BiPencil } from 'react-icons/bi';
import ToggleButton from '@/ui-components/toggleButton';
import MyButton from '@/ui-components/MyButton';
import NdviLayerPanel from '../NdviLayerPanel';
import LabelValueList from '@/ui-components/LabelValueList';
import isEmptyObject from '@/utils/isEmptyObject';
import { MapContext } from '@/contexts/MapContext';

export default function PlotPanel() {
  const {
    plots,
    showPlots,
    setShowPlots,
    handleFlyToPlot,
    handleEditPlot,
    showNdviLayer,
    toggleNDVILayersVisibility,
  } = useContext(PlotContext);

  const { mode } = useContext(MapContext);

  useEffect(() => {
    console.log('mode has changed', mode);
    if (mode === 'editing-plot') {
      console.log(showNdviLayer);
      toggleNDVILayersVisibility('none');
    } else {
      console.log(showNdviLayer);
      toggleNDVILayersVisibility('visible');
    }
  }, [mode]);

  return (
    <div className='panel-container'>
      <LabelValueList
        list={[
          {
            variant: 'collapsable',
            label: 'Plots',
            labelEnd: (
              <ToggleButton
                onTooltip='hide plots'
                offTooltip='show plots'
                initialState={showPlots}
                onToggle={setShowPlots}
              />
            ),
            value: (
              <ul className='overflow-y-scroll'>
                {plots.map((plot, index) => (
                  <li
                    key={index}
                    className='inline-flex justify-between items-center p-1 border border-collapse w-full'
                  >
                    <span
                      onClick={() =>
                        handleFlyToPlot(plot?.options.geometry.coordinates)
                      }
                      className='select-none cursor-pointer font-normal'
                    >
                      {plot.name}
                      {/* (
                      {!isEmptyObject(plot?.options) &&
                        squareMetersToAcres(
                          calculatePolygonArea(plot?.options)
                        ).toFixed(1)}
                      acres) */}
                    </span>
                    {!isEmptyObject(plot?.options) && (
                      <span onClick={() => handleEditPlot(plot)}>
                        <BiPencil className='action-icon' />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ),
          },
          {
            variant: 'collapsable',
            label: 'NDVI Layer',
            value: <NdviLayerPanel />,
            labelEnd: (
              <ToggleButton
                onTooltip={'hide NDVI layer'}
                offTooltip={'show NDVI layer'}
                initialState={showNdviLayer}
                onToggle={toggleNDVILayersVisibility}
              />
            ),
          },
        ]}
        itemClasses={'border p-1 m-0'}
      />
    </div>
  );
}
