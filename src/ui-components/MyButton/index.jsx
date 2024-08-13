import './styles.css';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const MyButton = forwardRef(function MyButton(
  {
    color = 'mute',
    size = 'sm',
    variant = 'fill',
    children,
    className,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={`my-button ${color} ${size} ${variant} ${className}`}
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
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MyButton;
