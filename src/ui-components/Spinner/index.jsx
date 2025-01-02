import PropTypes from 'prop-types';

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

const sizeClasses = {
  small: 'w-4 h-4',
  medium: 'w-8 h-8',
  large: 'w-16 h-16',
};

export default function Spinner({ size = 'medium' }) {
  return (
    <div className="spinner-container flex justify-center items-center">
      <div
        className={`spinner border-t-4 border-gray-700 dark:border-gray-200 rounded-full animate-spin ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}
