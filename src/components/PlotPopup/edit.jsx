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
import { useIntl } from 'react-intl';

export const EditPlotModal = ({ plot }) => {
  const [open, setOpen] = useState(false);
  const toDrawMode = useMapStore((state) => state.toDrawMode);
  const toNormalMode = useMapStore((state) => state.toNormalMode);
  const intl = useIntl();

  const { handlePlotUpdate, handleEditPlot, setClickedPlot } =
    useContext(PlotContext);

  const handleGeometryEdit = (e) => {
    setOpen(false);
    setClickedPlot(null);
    handleEditPlot(plot);
  };

  const plotUpdateHandler = (data) => {
    toast(intl.formatMessage({ id: 'app.agviewer_map.saving_changes', defaultMessage: 'Saving changes' }));
    return handlePlotUpdate(data).then(() => {
      setClickedPlot(null);
      toast.success(intl.formatMessage({ id: 'app.agviewer_map.changes_saved_successfully', defaultMessage: 'Changes saved successfully' }));
    });
  };

  return (
    <MyModal
      trigger={
        <Button variant="outline" size="icon">
          <Tooltip text={intl.formatMessage({ id: 'app.agviewer_map.edit_plot', defaultMessage: "Edit plot" })}>
            <BiPencil className="w-5 h-5 action-icon" />
          </Tooltip>
        </Button>
      }
      // 
      title={intl.formatMessage({ id: 'app.agviewer_map.edit_plot', defaultMessage: "Edit plot" })}
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
          submitButtonText={intl.formatMessage({ id: 'app.agviewer_map.save_changes', defaultMessage: "Save Changes" })}
        />
      </Card>
    </MyModal>
  );
};
