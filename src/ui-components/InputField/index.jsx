import React, { forwardRef } from 'react';
import Input from '../Input';

const InputField = forwardRef(function InputField(
  { type, name, label, ...props },
  ref
) {
  return (
    <div className='inline-flex items-center space-x-2'>
      <label className='text-gray-800 dark:text-gray-300' htmlFor={name}>
        {label || name}
      </label>
      <Input {...props} name={name} type={type} ref={ref} />
    </div>
  );
});

export default InputField;
