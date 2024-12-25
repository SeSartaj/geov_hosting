import './styles.css';
import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { fromJS } from 'immutable';
import MyButton from '../../ui-components/MyButton';
import MyModal from '../../ui-components/MyModal';
import Card from '@/ui-components/Card';

const AddNewStyleModal = () => {
  const [open, setOpen] = useState(false);
  const { mapStyle, setMapStyle } = useContext(MapContext);
  const [styleUrl, setStyleUrl] = useState(
    typeof mapStyle === 'string' ? mapStyle : ''
  );

  const handleUrlChange = (e) => {
    setStyleUrl(e.target.value);
  };

  const handleStyleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const newMapStyle = fromJS(JSON.parse(event.target.result));
      setMapStyle(newMapStyle);
      setOpen(false);
    };

    reader.readAsText(file);
  };
  const handleStyleChange = (e) => {
    // change
    setMapStyle(styleUrl);
  };

  return (
    <MyModal
      open={open}
      setOpen={setOpen}
      trigger={<MyButton>Add Map Style</MyButton>}
      title="Add Custom Map Style"
      description="Style url can be a mapbox style URL or a style.json using the Mapbox
            GL Style Spec"
    >
      <Card>
        <form onSubmit={handleStyleChange}>
          <input
            type="text"
            style={{ fontSize: 20, padding: 5 }}
            placeholder="paste style url here"
            name="style_url"
            className="Input"
            value={styleUrl}
            onChange={handleUrlChange}
          />
          <p>Or upload a file</p>
          <input
            type="file"
            style={{ fontSize: 20, padding: 5 }}
            name="style_file"
            className="Input"
            onChange={handleStyleFileChange}
          />
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end',
            }}
          >
            <MyButton variant="text">Cancel</MyButton>
            <MyButton onClick={handleStyleChange}>Add Style</MyButton>
          </div>
        </form>
      </Card>
    </MyModal>
  );
};

export default AddNewStyleModal;
