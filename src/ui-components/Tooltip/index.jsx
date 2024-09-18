import PropTypes from 'prop-types';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import './styles.css';
import React, { forwardRef } from 'react';

const Tooltip = forwardRef(function Tooltip(
  { children, text, portalContainer, ...props },
  ref
) {
  const [currentPortalContainer, setCurrentPortalContainer] = React.useState(
    portalContainer || document.body
  );

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;
      setCurrentPortalContainer(
        fullscreenElement || portalContainer || document.body
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
    };
  }, [portalContainer]);

  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild ref={ref}>
          <span>{children}</span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal container={currentPortalContainer}>
          <TooltipPrimitive.Content
            className='TooltipContent'
            side='top'
            align='center'
            {...props}
          >
            {text}
            {/* <TooltipPrimitive.Arrow
              className='TooltipArrow'
              width={11}
              height={5}
            /> */}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
});

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  portalContainer: PropTypes.element,
};

export default Tooltip;
