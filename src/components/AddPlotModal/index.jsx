import MyModal from '../../ui-components/MyModal';
import MyButton from '../../ui-components/MyButton';
import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { PlotContext } from '../../contexts/PlotContext';

const AddPlotModal = ({ polygon, deleteFeature }) => {
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const { addNewPlot } = useContext(PlotContext);

  const handleClose = () => {
    setOpen(false);
    deleteFeature();
  };

  const handlePlotCreation = (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formData = new FormData(e.target);

    // Get all form values
    const name = formData.get('name');
    const description = formData.get('description');

    polygon.properties = {
      id: name,
      name,
      description,
    };
    addNewPlot(polygon);
    deleteFeature();
    handleClose();
  };

  return (
    <MyModal
      trigger={<MyButton>Add New Plot</MyButton>}
      title='Add New Plot'
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
        name: <input type='text' name='name' /> <br />
        description: <input type='text' name='description' /> <br />
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
