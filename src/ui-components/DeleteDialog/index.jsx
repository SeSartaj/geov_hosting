import { confirmable } from 'react-confirm';
import PropTypes from 'prop-types';
import * as Dialog from '@radix-ui/react-dialog';
import { RxCross2 } from 'react-icons/rx';
import useConfirm from '@/hooks/useConfirm';
import MyButton from '../MyButton';
import { Button } from '@/components/ui/button';
import CloseButton from '@/components/CloseButton';

const DeleteDialog = () => {
  const { prompt = '', isOpen = true, proceed, cancel } = useConfirm();

  const handleClose = () => {
    cancel();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-6 rounded shadow-lg">
          <Dialog.Title className="text-lg font-bold dark:text-gray-200">
            Warning
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600 dark:text-gray-200">
            {prompt}
          </Dialog.Description>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={cancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => proceed(true)}>
              delete
            </Button>
          </div>
          <Dialog.Close asChild>
            <CloseButton className="absolute top-2 right-2" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

DeleteDialog.propTypes = {
  show: PropTypes.bool, // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func, // from confirmable. call to close the dialog with promise resolved.
  confirmation: PropTypes.string, // arguments of your confirm function
  options: PropTypes.object, // arguments of your confirm function
};

export default DeleteDialog;
