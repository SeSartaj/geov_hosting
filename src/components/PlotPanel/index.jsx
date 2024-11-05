import { useContext, useDebugValue, useEffect, useState } from 'react';
import { PlotContext } from '../../contexts/PlotContext';
import { calculatePolygonArea } from '../../utils/calculatePolygonArea';
import { squareMetersToAcres } from '../../utils/squareMetersToAcres';
import { BiPencil, BiTrash } from 'react-icons/bi';
import ToggleButton from '@/ui-components/toggleButton';
import NdviLayerPanel from '../NdviLayerPanel';
import LabelValueList from '@/ui-components/LabelValueList';
import isEmptyObject from '@/utils/isEmptyObject';
import { MapContext } from '@/contexts/MapContext';
import MyButton from '@/ui-components/MyButton';
import Tooltip from '@/ui-components/Tooltip';
import useConfirm from '@/hooks/useConfirm';

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

  const { isConfirmed } = useConfirm();

  const handleDeletePlot = async (e) => {
    // get marker id from data-marker-id attribute
    // ask for confirmatino whether to delete the marker or not?
    const confirmed = await isConfirmed('Do you want to delete this Plot?');
    console.log('confirmed', confirmed);
  };

  return (
    <div className="panel-container">
      <div className="panel-header-action pb-3">
        <h3 className="text-lg">Plots</h3>
        <ToggleButton
          onTooltip="hide plots"
          offTooltip="show plots"
          initialState={showPlots}
          onToggle={setShowPlots}
        />
      </div>

      <LabelValueList
        className="pr-1 mb-1"
        list={[
          {
            variant: 'collapsable',
            label: 'Plot NDVI Layers',
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
      <div className="panel-content pr-1">
        {plots.map((plot, index) => (
          <li
            key={index}
            className="inline-flex justify-between items-center p-1 border border-solid border-collapse dark:border-gray-500 w-full"
          >
            <span
              onClick={() =>
                handleFlyToPlot(plot?.options.geometry.coordinates)
              }
              className="select-none cursor-pointer font-normal"
            >
              {plot.name}
              {/* (
                      {!isEmptyObject(plot?.options) &&
                        squareMetersToAcres(
                          calculatePolygonArea(plot?.options)
                        ).toFixed(1)}
                      acres) */}
            </span>
            <span className="flex items-center gap-1">
              <Tooltip text="click to delete the plot">
                <MyButton
                  variant="icon"
                  className="rounded-full"
                  onClick={handleDeletePlot}
                >
                  <BiTrash className="action-icon text-red-500" />
                </MyButton>
              </Tooltip>
              {plot?.options && !isEmptyObject(plot?.options) && (
                <Tooltip text="click to edit the plot">
                  <MyButton
                    variant="icon"
                    className="rounded-full"
                    onClick={() => handleEditPlot(plot)}
                  >
                    <BiPencil className="action-icon" />
                  </MyButton>
                </Tooltip>
              )}
            </span>
          </li>
        ))}
      </div>
    </div>
  );
}
