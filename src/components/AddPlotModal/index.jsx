import MyModal from '../../ui-components/MyModal';
import MyButton from '../../ui-components/MyButton';
import { useContext, useEffect, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { PlotContext } from '../../contexts/PlotContext';
import Input from '@/ui-components/Input';
import FormGroup from '@/ui-components/FormGroup';
import MyReactSelect from '@/ui-components/MyReactSelect';
import { getFarmOptions } from '@/api/farmApi';
import Card from '@/ui-components/Card';
import { Button } from '../ui/button';
import PlotForm from '@/forms/plot';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';

const AddPlotModal = ({ polygon, deleteFeature, trigger }) => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const { addNewPlot } = useContext(PlotContext);
  const [farm, setFarm] = useState(null);
  const [farmOptions, setFarmOptions] = useState([]);
  const [farmsLoading, setFarmsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const handleClose = () => {
    setOpen(false);
    deleteFeature();
  };

  const handlePlotCreation = (formData) => {
    console.log('handlePlotCreation data', formData);
    setLoading(true);

    // Get all form valuess
    addNewPlot(formData)
      .then(() => {
        deleteFeature();
        toast.success(intl.formatMessage({ id: 'app.agviewer_map.plot_success_message', defaultMessage: 'Plot created successfully' }));
      })
      .catch((e) => {
        toast.error(intl.formatMessage({ id: 'app.agviewer_map.plot_failed_message', defaultMessage: 'Could not create the plot' }));
      })
      .finally(() => {
        setLoading(false);
        handleClose();
      });
  };

  useEffect(() => {
    setFarmsLoading(true);
    getFarmOptions()
      .then((options) => {
        setFarmOptions(options);
      })
      .finally(() => {
        setFarmsLoading(false);
      });
  }, []);

  return (
    <MyModal
      trigger={trigger || <Button color="primary">{intl.formatMessage({ id: 'app.agviewer_map.add_new_plot', defaultMessage: "Add New Plot" })}</Button>}
      title={intl.formatMessage({ id: 'app.agviewer_map.add_new_plot', defaultMessage: "Add New Plot" })}
      headerClassName="m-4"
      open={open}
      setOpen={setOpen}
      portalContainer={
        mapRef?.current
          ? mapRef?.current?.getMap().getContainer()
          : document.body
      }
    >
      <Card>
        <div className="h-[400px] overflow-y-auto">
          <PlotForm
            initialValues={{ options: polygon }}
            onSubmit={handlePlotCreation}
            className="p-4"
            submitButtonText={intl.formatMessage({ id: 'app.agviewer_map.create_plot', defaultMessage: "Create Plot" })}
            onCancel={() => setOpen(false)}
          />
        </div>
      </Card>
    </MyModal>
  );
};

export default AddPlotModal;
