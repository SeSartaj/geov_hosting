import { useContext } from 'react';
import { BASEMAP_OPTIONS } from '../../../constants';
import MyButton from '../../../ui-components/MyButton';
import './styles.css';
import { SettingsContext } from '../../../contexts/SettingsContext';

export default function MapStyleSwitcher() {
  const { settings, setSettings } = useContext(SettingsContext);

  const handleStyleChange = (e) => {
    const id = e.target.getAttribute('data-id');
    setSettings({ ...settings, basemap: { ...settings.basemap, id } });
  };

  return (
    <div className="flex justify-between flex-wrap gap-[3px] ">
      {BASEMAP_OPTIONS.map((o) => (
        <MyButton
          data-id={o.id}
          key={o.id}
          variant="fill"
          color="mute"
          className={`w-full sm:w-auto ${
            o.id === settings.basemap.id ? 'brightness-[0.8]' : ''
          }`}
          onClick={handleStyleChange}
          disabled={o.id === settings.basemap.id}
          size="md"
        >
          {o.name}
        </MyButton>
      ))}
    </div>
  );
}
