import { useState, useContext } from 'react';
import { MapContext } from '../../../contexts/MapContext';
import { BiTrash } from 'react-icons/bi';
import AddNewLayerModal from '../../AddNewLayer';
import AddNewSourceModal from '../../AddNewSourceModal';
import Layer from '../../Layer';
import MyReactSelect from '@/ui-components/MyReactSelect';
import FormGroup from '@/ui-components/FormGroup';
import ToggleButton from '@/ui-components/toggleButton';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import Input from '@/ui-components/Input';

export default function LayerPanel() {
  const { layer, layerOptions, setLayer, opacity, handleOpacityChange } =
    useContext(RasterLayerContext);

  return (
    <div className='panel-container h-full overflow-y-scroll'>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Map Raster Layers</h3>
        {/* <AddNewLayerModal setLayers={setLayers} /> */}
        <ToggleButton onTooltip='hide layer' offTooltip='show layer' />
      </div>
      <hr />
      <ul className='layers-list'>
        <FormGroup label='layer:'>
          <MyReactSelect
            size='sm'
            className='w-full'
            value={layer}
            options={layerOptions}
            onChange={(l) => setLayer(l)}
            isClearable={false}
          />
        </FormGroup>
        <hr />
        <span>Opacity</span>
        <Input
          type='range'
          min='0'
          max='100'
          value={opacity}
          onChange={handleOpacityChange}
          className='w-full'
        />
        <hr />
        <span>Calender:</span>
      </ul>
    </div>
  );
}
