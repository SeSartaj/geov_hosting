import { BiPencil } from 'react-icons/bi';
import { useCallback, useContext, useState } from 'react';
import MyButton from '@/ui-components/MyButton';
import Card from '@/ui-components/Card';
import Tooltip from '@/ui-components/Tooltip';
import { PlotContext } from '@/contexts/PlotContext';
import MyModal from '@/ui-components/MyModal';
import PlotForm from '@/forms/plot';
import { Button } from '../ui/button';
import useMapStore from '@/stores/mapStore';
import { toast } from 'sonner';

export const EditPlotModal = ({ plot }) => {
  const [open, setOpen] = useState(false);
  const toDrawMode = useMapStore((state) => state.toDrawMode);
  const toNormalMode = useMapStore((state) => state.toNormalMode);

  const { handlePlotUpdate, handleEditPlot, setClickedPlot } =
    useContext(PlotContext);

  const handleGeometryEdit = (e) => {
    setOpen(false);
    setClickedPlot(null);
    console.log('plot is', plot);
    handleEditPlot(plot);
  };

  const plotUpdateHandler = (data) => {
    toast('saving changes');
    return handlePlotUpdate(data).then(() => {
      setClickedPlot(null);
      toast.success('changes saved successfully');
    });
  };

  return (
    <MyModal
      trigger={
        <Button variant="outline" size="icon">
          <Tooltip text="click to edit the plot">
            <BiPencil className="w-5 h-5 action-icon" />
          </Tooltip>
        </Button>
      }
      title="Edit Plot"
      open={open}
      setOpen={setOpen}
      headerClassName="m-4"
      onClose={() => setOpen(false)}
    >
      <Card>
        <PlotForm
          plot={plot}
          onSubmit={plotUpdateHandler}
          onCancel={() => setOpen(false)}
          onGeometryChange={handleGeometryEdit}
          submitButtonText="Save Changes"
        />
      </Card>
    </MyModal>
  );
};
