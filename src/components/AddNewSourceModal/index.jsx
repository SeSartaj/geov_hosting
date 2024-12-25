import * as Dialog from '@radix-ui/react-dialog';
import './styles.css';
import { BiX } from 'react-icons/bi';
import { useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import MyModal from '../../ui-components/MyModal';
import MyButton from '../../ui-components/MyButton';
import Card from '@/ui-components/Card';

const AddNewSourceModal = ({ setSources }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [fileContent, setFileContent] = useState();
  const [open, setOpen] = useState(false);
  const { mapRef } = useContext(MapContext);
  const [url, setUrl] = useState('');

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleFileChange = (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const source = JSON.parse(event.target.result);
      // add source from file content
      setFileContent(source);
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleAddSource = () => {
    const data = url ? url : fileContent;
    mapRef?.current.addSource(name, {
      type: 'geojson',
      data: data,
    });
    setSources(mapRef?.current.getStyle()?.sources);
    setOpen(false);
  };

  return (
    <MyModal
      open={open}
      setOpen={setOpen}
      title="Add New GeoJSON Source"
      trigger={<MyButton>Add New Source</MyButton>}
      description="You can add a new source from a GeoJSON url or a file upload"
    >
      <Card>
        <form onSubmit={handleAddSource}>
          <input
            type="text"
            style={{ fontSize: 20, padding: 5, marginBottom: 5 }}
            placeholder="Source Name"
            name="name"
            className="Input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            style={{ fontSize: 20, padding: 5 }}
            placeholder="geojson file's url here"
            name="style_url"
            className="Input"
            value={url}
            onChange={handleUrlChange}
          />
          <p>Or upload a file</p>
          <input
            type="file"
            style={{ fontSize: 20, padding: 5 }}
            name="style_file"
            className="Input"
            onChange={handleFileChange}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <MyButton variant="text" onClick={() => setOpen(false)}>
              cancel
            </MyButton>
            <MyButton type="submit">Add Marker</MyButton>
          </div>
        </form>
      </Card>
    </MyModal>
  );
};

export default AddNewSourceModal;
