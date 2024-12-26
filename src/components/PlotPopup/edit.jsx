import { BiPencil } from 'react-icons/bi';
import { useCallback, useContext, useState } from 'react';
import MyButton from '@/ui-components/MyButton';
import Card from '@/ui-components/Card';
import Tooltip from '@/ui-components/Tooltip';
import { PlotContext } from '@/contexts/PlotContext';
import MyModal from '@/ui-components/MyModal';
import PlotForm from '@/forms/plot';

export const EditPlotModal = ({ plot }) => {
  const [open, setOpen] = useState(false);
  const { handleEditPlot } = useContext(PlotContext);

  const _onChangeVisibility = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handlerEditPlot = (data) => {
    return handleEditPlot(data);
  };

  return (
    <MyModal
      trigger={
        <MyButton
          variant="icon"
          className="rounded-md !border !border-solid !border-[#D1D5DB] dark:!border-gray-200 !bg-inherit"
        >
          <Tooltip text="click to edit the plot">
            <BiPencil className="w-5 h-5 action-icon" />
          </Tooltip>
        </MyButton>
      }
      title="Edit Plot"
      open={open}
      setOpen={setOpen}
      headerClassName="m-4"
      onClose={_onChangeVisibility}
    >
      <Card>
        <PlotForm
          plot={plot}
          onSubmit={handlerEditPlot}
          onCancel={_onChangeVisibility}
          submitButtonText="Save Changes"
        />
      </Card>
    </MyModal>
  );
};
