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

const AddPlotModal = ({ polygon, deleteFeature, trigger }) => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const { addNewPlot } = useContext(PlotContext);
  const [farm, setFarm] = useState(null);
  const [farmOptions, setFarmOptions] = useState([]);
  const [farmsLoading, setFarmsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

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
        toast.success('Plot created successfully');
      })
      .catch((e) => {
        toast.error('Could not create the plot');
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
      trigger={trigger || <Button color="primary">Add New Plot</Button>}
      title="Add New Plot"
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
        <PlotForm
          initialValues={{ options: polygon }}
          onSubmit={handlePlotCreation}
          className="p-4"
          submitButtonText="Create Plot"
        />
      </Card>
    </MyModal>
  );
};

export default AddPlotModal;
