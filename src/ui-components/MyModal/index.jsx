import './styles.css';

import * as Dialog from '@radix-ui/react-dialog';
import MyButton from '../MyButton';
import PropTypes from 'prop-types';
import { BiX } from 'react-icons/bi';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function MyModal({
  trigger,
  title,
  description,
  children,
  open,
  setOpen,
  headerClassName,
  onClose,
  onChange,
}) {
  const [portalContainer, setPortalContainer] = useState(document.body);

  // Function to detect if fullscreen is active
  const checkFullscreen = () => {
    const fullscreenElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
    setPortalContainer(fullscreenElement || document.body);
  };

  useEffect(() => {
    checkFullscreen();
    // Listen for fullscreen change events
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('mozfullscreenchange', checkFullscreen);
    document.addEventListener('MSFullscreenChange', checkFullscreen);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
      document.removeEventListener('mozfullscreenchange', checkFullscreen);
      document.removeEventListener('MSFullscreenChange', checkFullscreen);
    };
  }, []);

  const handleOpenChange = () => {
    console.log('clicked on handleOpenChange');
    setOpen(!open);
    if (onChange) {
      onChange();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal container={portalContainer}>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content
          className="DialogContent overflow-y-auto  m-0 p-0"
          disablefocuslock="true"
          asChild
        >
          <Card>
            <div className={headerClassName}>
              {title && (
                <Dialog.Title
                  className={`text-lg font-semibold DialogTitle dark:text-gray-100 `}
                >
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="DialogDescription dark:text-gray-200">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <div>{children}</div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                style={{ position: 'absolute', top: 10, right: 10 }}
                aria-label="Close"
                onClick={onClose}
              >
                <XIcon />
              </Button>
            </Dialog.Close>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

MyModal.propTypes = {
  trigger: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  headerClassName: PropTypes.string,
  // portalContainer: PropTypes.element,
};
