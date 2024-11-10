import './styles.css';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Spinner from '../Spinner';

const MyButton = forwardRef(function MyButton(
  {
    color = 'mute',
    size = 'sm',
    variant = 'fill',
    children,
    className,
    loading,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={`my-button ${color} ${size} ${variant} ${
        className ? className : ''
      } dark:text-gray-100 ${
        variant == 'text' ? 'bg-gray-100 dark:bg-gray-800' : ''
      }`}
      disabled={loading}
      {...rest}
    >
      {loading ? <Spinner /> : null}
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
  loading: PropTypes.bool,
};

export default MyButton;
