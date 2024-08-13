import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(function Input({ size = 'sm', ...props }, ref) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  return (
    <input
      ref={ref}
      className={`border rounded  ${sizeClasses[size]}`}
      {...props}
    />
  );
});

Input.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Input;
