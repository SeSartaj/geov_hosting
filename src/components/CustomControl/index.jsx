import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useControl } from 'react-map-gl/maplibre';
import ReactDOMServer from 'react-dom/server';
import './styles.css';

function CustomControlButton({ onClick, label, Icon }) {
  const controlRef = useRef();
  const buttonRef = useRef();

  const handleClick = useCallback(() => {
    onClick({ controlRef, buttonRef });
  }, [onClick, controlRef, buttonRef]);

  useControl(
    () => {
      return {
        onAdd: () => {
          const controlDiv = document.createElement('div');
          controlDiv.className = 'maplibregl-ctrl-group maplibregl-ctrl';

          const controlButton = document.createElement('button');
          controlButton.className = `maplibregl-ctrl-icon dtl-btn flex justify-center items-center`;
          controlButton.type = 'button';

          controlButton.setAttribute('aria-label', label);
          controlButton.title = label;
          controlButton.onclick = handleClick;

          controlButton.innerHTML = ReactDOMServer.renderToString(Icon);

          controlDiv.appendChild(controlButton);
          controlRef.current = controlDiv;
          buttonRef.current = controlButton;

          return controlDiv;
        },
        onRemove: () => {
          controlRef.current.parentNode.removeChild(controlRef.current);
        },
      };
    },
    { position: 'top-right' }
  );

  return null;
}
CustomControlButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  // Icon: PropTypes.elementType.isRequired,
};

export default CustomControlButton;
