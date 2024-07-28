import './styles.css';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const MyButton = forwardRef(function MyButton(
  { color = 'mute', size = 'md', variant = 'fill', children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`my-button ${color} ${size} ${variant}`}
      {...rest}
    >
      {children}
    </button>
  );
});

MyButton.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'success',
    'info',
    'warning',
    'danger',
    'mute',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['fill', 'text', 'icon']),
  children: PropTypes.node,
};

export default MyButton;
