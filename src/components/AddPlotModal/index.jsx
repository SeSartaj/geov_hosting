import MyModal from '../../ui-components/MyModal';
import MyButton from '../../ui-components/MyButton';
import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { PlotContext } from '../../contexts/PlotContext';
import Input from '@/ui-components/Input';
import FormGroup from '@/ui-components/FormGroup';

const AddPlotModal = ({ polygon, deleteFeature }) => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const { addNewPlot } = useContext(PlotContext);

  const handleClose = () => {
    setOpen(false);
    deleteFeature();
  };

  const handlePlotCreation = async (e) => {
    e.preventDefault();

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

    addNewPlot(newPlot);
    deleteFeature();
    handleClose();
  };

  return (
    <MyModal
      trigger={<MyButton>Add New Plot</MyButton>}
      title='Add New Plot '
      description='add new plot  map'
      open={open}
      setOpen={setOpen}
      portalContainer={
        mapRef?.current
          ? mapRef?.current?.getMap().getContainer()
          : document.body
      }
    >
      <form onSubmit={handlePlotCreation}>
        <FormGroup label='Name:'>
          <Input type='text' name='name' className='w-full' />
        </FormGroup>
        <FormGroup label='description'>
          <Input type='text' name='description' className='w-full' />
        </FormGroup>
        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <MyButton type='cancel' variant='text' onClick={handleClose}>
            cancel
          </MyButton>
          <MyButton type='submit'>Add Plot</MyButton>
        </div>
      </form>
    </MyModal>
  );
};

export default AddPlotModal;
