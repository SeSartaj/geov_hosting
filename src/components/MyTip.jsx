import PropTypes from 'prop-types';

import Microtip from 'react-microtip';

export default function MyTip({ children, text }) {
  return (
    <Microtip
      content={text}
      duration={50}
      delay={1000}
      easing='ease-in'
      position='top'
    >
      {children}
    </Microtip>
  );
}

MyTip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
};
