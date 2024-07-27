import PropTypes from 'prop-types';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import './styles.css';
import { useContext } from 'react';
import { MapContext } from '../../contexts/MapContext';

export default function Tooltip({ children, text, ...props }) {
  const { mapRef } = useContext(MapContext);

  console.log('mapRef', mapRef);
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <span>{children}</span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal
          container={mapRef?.current?.getMap().getContainer() || document.body}
        >
          <TooltipPrimitive.Content
            portalled={false}
            className='TooltipContent'
            side='top'
            align='center'
            {...props}
          >
            {text}
            <TooltipPrimitive.Arrow
              className='TooltipArrow'
              width={11}
              height={5}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
};
