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

  const handlePlotCreation = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a new FormData object
      const formData = new FormData(e.target);

      // Get all form valuess
      const name = formData.get('name');
      const description = formData.get('description');

      polygon.properties = {
        name,
        description,
      };

      const newPlot = {
        name: name,
        options: polygon,
      };

      await addNewPlot(newPlot);
    } finally {
      setLoading(false);
      deleteFeature();
      handleClose();
    }
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
      title="Add New Plot "
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
        <form onSubmit={handlePlotCreation} className="p-4">
          <FormGroup label="Name:">
            <Input type="text" name="name" className="w-full" />
          </FormGroup>
          <FormGroup label="Farm">
            <MyReactSelect
              className="w-full"
              value={farm}
              options={farmOptions}
              onChange={(f) => setFarm(f)}
              isLoading={farmsLoading}
            />
          </FormGroup>
          <FormGroup label="description">
            <Input type="text" name="description" className="w-full" />
          </FormGroup>
          <br />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              type="cancel"
              variant="outline"
              onClick={!loading && handleClose}
              disabled={loading}
            >
              cancel
            </Button>
            <Button type="submit" loading={loading} color="primary">
              Add Plot
            </Button>
          </div>
        </form>
      </Card>
    </MyModal>
  );
};

export default AddPlotModal;
