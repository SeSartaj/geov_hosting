import {
  FaBatteryFull,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaBatteryEmpty,
} from 'react-icons/fa';

const BatteryIndicator = ({ level }) => {
  let BatteryIcon;
  let color = '#111'; // Default color

  if (level > 75) {
    BatteryIcon = FaBatteryFull;
  } else if (level > 50) {
    BatteryIcon = FaBatteryHalf;
  } else if (level > 25) {
    BatteryIcon = FaBatteryQuarter;
  } else {
    BatteryIcon = FaBatteryEmpty;
    color = 'red'; // Color when battery is low
  }

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', fontSize: '24px', color }}
    >
      <BatteryIcon />
      <span style={{ marginLeft: '8px', fontSize: 12 }}>{level}%</span>
    </div>
  );
};

export default BatteryIndicator;
