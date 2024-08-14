import Tooltip from '@/components/Tooltip';
import React, { useState } from 'react';

const ToggleButton = ({
  initialState = false,
  onToggle,
  onTooltip,
  offTooltip,
}) => {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = () => {
    setIsOn(!isOn);
    if (onToggle) {
      onToggle(!isOn);
    }
  };

  return (
    <Tooltip text={isOn ? onTooltip : offTooltip}>
      <button
        onClick={handleToggle}
        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none ${
          isOn ? 'bg-blue-700' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform duration-300 ${
            isOn ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </Tooltip>
  );
};

export default ToggleButton;
