import React, { useEffect } from 'react'; // Add this line to import the 'React' module
import PropTypes from 'prop-types';
import { useState } from 'react';
import Tooltip from '@/ui-components/Tooltip';
import Spinner from '../Spinner';

const ToggleButton = React.memo(function Togglebutton({
  value = false,
  onToggle,
  onChange,
  onTooltip,
  offTooltip,
  isLoading = false,
  size = 'sm', // Default size is 'md'
}) {
  const handleToggle = () => {
    if (onChange) {
      onChange(!value);
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
    <Tooltip text={value ? onTooltip : offTooltip}>
      <button
        type="button"
        onClick={handleToggle}
        className={`relative  inline-flex items-center rounded-full transition-colors duration-300 focus:outline-none  focus:outline focus:outline-2 focus:outline-offset-1 ${
          value ? 'bg-blue-700' : 'bg-gray-300'
        } ${sizeClasses[size].button}`}
      >
        {isLoading ? (
          <Spinner size="small" />
        ) : (
          <span
            className={`inline-block transform rounded-full bg-white transition-transform duration-300 ${
              value ? sizeClasses[size].translate : 'translate-x-1'
            } ${sizeClasses[size].circle}`}
          />
        )}
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
