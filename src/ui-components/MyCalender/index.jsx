import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export function MyCalender() {
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      disabled={disabledDays}
      modifiers={{
        highlighted: new Date(2024, 11, 25), // Highlight a specific day
      }}
      modifiersClassNames={{
        highlighted: 'highlighted-day', // Custom class for highlighted day
      }}
      classNames={{
        day: 'custom-day', // General day class
        selected: 'selected-day', // Class for selected day
      }}
    />
  );
}
