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
    <div className='switcher'>
      {BASEMAP_OPTIONS.map((o) => (
        <MyButton
          data-id={o.id}
          key={o.id}
          className={o.id === settings.basemap.id ? 'active-switch ' : ''}
          onClick={handleStyleChange}
          disabled={o.id === settings.basemap.id}
        >
          {o.name}
        </MyButton>
      ))}
    </div>
  );
}
