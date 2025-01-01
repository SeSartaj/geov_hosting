import React from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/button';

const CloseButton = React.forwardRef(({ onClose, ...props }, ref) => (
  <Button ref={ref} variant="outline" size="icon" onClick={onClose} {...props}>
    <XIcon className="w-5 h-5 action-icon" />
  </Button>
));

export default CloseButton;
