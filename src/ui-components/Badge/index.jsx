import React from 'react';

const Badge = ({ color = 'blue', children, variant = 'circle' }) => {
  const badgeStyle = {
    fontSize: 'inherit',
    backgroundColor: variant === 'background' ? color : 'transparent',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#f2f2f2',
    fontWeight: 'bold',
    padding: variant === 'circle' ? '0' : '0.5em 1em',
    border: variant === 'circle' ? `2px solid ${color}` : 'none',
  };

  const circleStyle = {
    width: '1em',
    height: '1em',
    backgroundColor: color,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '0.2em',
  };

  if (variant === 'circle') {
    return (
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <div style={circleStyle}></div>
        <span> {children}</span>
      </span>
    );
  }

  return <div style={badgeStyle}>{children}</div>;
};

export default Badge;
