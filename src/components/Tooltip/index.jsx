import PropTypes from 'prop-types';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import './styles.css';
import { useContext } from 'react';
import { MapContext } from '../../contexts/MapContext';

export default function Tooltip({ children, text, portalContainer, ...props }) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <span>{children}</span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal
          container={portalContainer ? portalContainer : document.body}
        >
          <TooltipPrimitive.Content
            className='TooltipContent dark:bg-gray-600'
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
  portalContainer: PropTypes.element,
};
