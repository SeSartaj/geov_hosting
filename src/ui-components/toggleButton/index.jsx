import React from 'react'; // Add this line to import the 'React' module
import PropTypes from 'prop-types';
import Tooltip from '@/components/Tooltip';
import { useState } from 'react';

const ToggleButton = React.memo(function Togglebutton({
  initialState = false,
  onToggle,
  onTooltip,
  offTooltip,
  size = 'sm', // Default size is 'md'
}) {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = () => {
    setIsOn(!isOn);
    if (onToggle) {
      onToggle(!isOn);
    }
  };

  // Define size classes
  const sizeClasses = {
    sm: {
      button: 'h-4 w-7',
      circle: 'w-3 h-3',
      translate: 'translate-x-3',
    },
    md: {
      button: 'h-6 w-11',
      circle: 'w-4 h-4',
      translate: 'translate-x-5',
    },
    lg: {
      button: 'h-8 w-14',
      circle: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  return (
    <Tooltip text={isOn ? onTooltip : offTooltip}>
      <button
        onClick={handleToggle}
        className={`relative inline-flex items-center rounded-full transition-colors duration-300 focus:outline-none ${
          isOn ? 'bg-blue-700' : 'bg-gray-300'
        } ${sizeClasses[size].button}`}
      >
        <span
          className={`inline-block transform rounded-full bg-white transition-transform duration-300 ${
            isOn ? sizeClasses[size].translate : 'translate-x-1'
          } ${sizeClasses[size].circle}`}
        />
      </button>
    </Tooltip>
  );
});

ToggleButton.propTypes = {
  initialState: PropTypes.bool,
  onToggle: PropTypes.func,
  onTooltip: PropTypes.string.isRequired,
  offTooltip: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default ToggleButton;
