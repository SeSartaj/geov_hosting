import React, { useState } from 'react';

export function AccordionItem({ label, children }) {
  const [show, setShow] = useState(false);

  return (
    <>
      {typeof label === 'function' && label({ show, setShow })}
      {typeof label !== 'function' &&
        React.cloneElement(label, { onClick: () => setShow(!show) })}
      {show && children}
    </>
  );
}
