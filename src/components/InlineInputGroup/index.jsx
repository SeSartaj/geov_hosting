import React from 'react';
import './styles.css';

const InlineInputGroup = ({ label }) => {
  return (
    <div className='i-group'>
      <label className='i-label'>{label}</label>
      {children}
    </div>
  );
};

export default InlineInputGroup;
