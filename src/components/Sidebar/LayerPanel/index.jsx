import {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { MapContext } from '../../../contexts/MapContext';
import MyReactSelect from '@/ui-components/MyReactSelect';
import ToggleButton from '@/ui-components/toggleButton';
import { RasterLayerContext } from '@/contexts/RasterLayerContext';
import Input from '@/ui-components/Input';

import { layerOptions } from '@/constants';
import useMapStore from '@/stores/mapStore';
import { RadioGroup, RadioGroupItem } from '@/ui-components/RadioGroup';
import Label from '@/ui-components/Label';
import { Popover } from '@/ui-components/popover';
import debounce from '@/utils/debounce';
import { useIntl } from 'react-intl';
import AvailableDatesCalender from '@/components/AvailableDatesCalender';

export default function LayerPanel({ mapRef }) {
  const { isVisible, setIsVisible } = useContext(RasterLayerContext);
  const datesLoading = useMapStore((s) => s.datesLoading);
  const intl = useIntl();

  const rasterOpacity = useMapStore((state) => state.rasterOpacity);
  const setRasterOpacity = useMapStore((state) => state.setRasterOpacity);
  const viewMode = useMapStore((state) => state.viewMode);

  const rasterLayer = useMapStore((state) => state.rasterLayer);
  const setRasterLayer = useMapStore((state) => state.setRasterLayer);

  const mapInstance = mapRef?.currnet;
  const map = mapRef?.current?.getMap();
  const showCroppedImages = useMapStore((s) => s.showCroppedImages);
  const setShowCroppedImages = useMapStore((s) => s.setShowCroppedImages);

  const setDateRange = useMapStore((state) => state.setDateRange);
  const dateRange = useMapStore((state) => state.dateRange);

  const toggleRasterRenderingMethod = useCallback(
    (value) => {
      if (value === 'plot') {
        setShowCroppedImages(true);
      }
      if (value === 'map') {
        setShowCroppedImages(false);
      }
    },
    [setShowCroppedImages]
  );

  const setCroppedRasterLayersOpacity = useCallback(
    (op) => {
      if (!mapInstance) return;

      mapInstance.getStyle().layers.forEach((layer) => {
        if (layer.id.startsWith('croppedImageLayer-')) {
          mapInstance.setPaintProperty(
            layer.id,
            'raster-opacity',
            Number(op / 100)
          );
        }
      });
    },
    [mapInstance]
  );

  const debouncedSetCroppedRasterLayersOpacity = debounce(
    setCroppedRasterLayersOpacity,
    500
  );

  const handleRasterOpacityChange = useCallback((e) => {
    const op = e.target.value;
    setRasterOpacity(op);
    debouncedSetCroppedRasterLayersOpacity(op);
    // Store the opacity in state
  });

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-2 rounded-md bg-zinc-50 dark:bg-zinc-800 p-2">
        <div className="flex items-center justify-between">
          <h4 className="text-base dark:text-gray-100 tracking-tight">
            {intl.formatMessage({
              id: 'app.agviewer_map.raster_layer',
              defaultMessage: 'Raster Layer',
            })}
          </h4>
          <div className="flex items-center space-x-2">
            <RadioGroup
              defaultValue={showCroppedImages ? 'plot' : 'map'}
              className="flex items-center"
              onValueChange={toggleRasterRenderingMethod}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="plot" id="plot" />
                <Label htmlFor="plot">
                  {intl.formatMessage({
                    id: 'app.agviewer_map.plot',
                    defaultMessage: 'Plot',
                  })}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="map" id="map" />
                <Label htmlFor="map">
                  {intl.formatMessage({
                    id: 'app.agviewer_map.map',
                    defaultMessage: 'Map',
                  })}
                </Label>
              </div>
            </RadioGroup>
            <ToggleButton
              onTooltip={intl.formatMessage({
                id: 'app.agviewer_map.hide_layer',
                defaultMessage: 'Hide Layer',
              })}
              offTooltip={intl.formatMessage({
                id: 'app.agviewer_map.show_layer',
                defaultMessage: 'Show Layer',
              })}
              value={isVisible}
              onChange={setIsVisible}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <div className="w-full flex flex-col gap-2.5 mt-4">
            <div className="flex items-center justify-between w-full">
              <h4 className="text-base dark:text-gray-100 tracking-tight">
                {intl.formatMessage({
                  id: 'app.agviewer_map.opacity',
                  defaultMessage: 'Opacity',
                })}
              </h4>
              {viewMode !== 'PICKER' && (
                <Popover
                  trigger={
                    <div className="border border-solid border-[#D1D5DB] cursor-pointer dark:border-gray-200 rounded-md p-2 flex items-center justify-center">
                      <h5 className="scroll-m-20 text-sm font-medium tracking-tight">
                        {rasterOpacity}%
                      </h5>
                    </div>
                  }
                >
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={rasterOpacity}
                    onChange={handleRasterOpacityChange}
                    className="w-full"
                  />
                </Popover>
              )}
              <MyReactSelect
                size="sm"
                className="w-full"
                value={rasterLayer}
                options={layerOptions}
                placeholder="Select Data"
                onChange={setRasterLayer}
                isClearable={false}
              />
            </div>

            <AvailableDatesCalender
              mapRef={mapRef}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
