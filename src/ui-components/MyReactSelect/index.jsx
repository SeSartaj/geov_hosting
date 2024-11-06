import { SettingsContext, useDarkMode } from '@/contexts/SettingsContext';
import { usePrefersDarkMode } from '@/hooks/usePrefersDarkMode';
import { forwardRef, useContext } from 'react';
import Select from 'react-select';

const sizeClasses = {
  sm: 'text-sm min-w-[120px]', // Adjust the min-width value as needed
  md: 'text-base min-w-[160px]', // Adjust the min-width value as needed
  lg: 'text-lg min-w-[200px]', // Adjust the min-width value as needed
};

const MyReactSelect = forwardRef(function MyReactSelect(
  { size = 'sm', name, formRef, ...props },
  ref
) {
  const isDarkMode = useDarkMode();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#1f2937' : '#FFFFFF', // gray-700 for dark mode, white for light mode
      borderColor: isDarkMode ? '#6B7280' : '#D1D5DB', // gray-500 for dark mode, gray-300 for light mode
      borderWidth: '1px',
      color: isDarkMode ? '#FFFFFF' : '#111827', // white text for dark mode, gray-900 for light mode
      boxShadow: state.isFocused
        ? isDarkMode
          ? '0 0 0 2px #3B82F6'
          : '0 0 0 2px #2563EB'
        : 'none',
      ...(sizeClasses[size] && {
        padding: 0,
        userSelect: 'none',
      }),
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDarkMode ? '#FFFFFF' : '#111827', // white text for dark mode, gray-900 for light mode
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#374151' : '#E5E7EB', // gray-700 for dark mode, gray-200 for light mode
      color: isDarkMode ? '#FFFFFF' : '#111827', // white text for dark mode, gray-900 for light mode
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: isDarkMode ? '#FFFFFF' : '#111827', // white text for dark mode, gray-900 for light mode
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#1f2937' : '#FFFFFF', // gray-800 for dark mode, white for light mode
      color: isDarkMode ? '#FFFFFF' : '#111827', // white text for dark mode, gray-900 for light mode
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDarkMode
          ? '#4B5563'
          : '#E5E7EB' // gray-600 for focused item in dark mode, gray-200 in light mode
        : isDarkMode
        ? '#1F2937'
        : '#FFFFFF', // gray-800 for dark mode, white for light mode
      color: isDarkMode ? '#E5E7EB' : '#111827', // white text for dark mode, gray-900 for light mode
    }),
  };

  // added the formRef for the temporary bug where focus not go to next element when form is
  // used on radix-ui/dialog/modal
  const handleTabChange = (event) => {
    if (event.key !== 'Tab') return;

    event.preventDefault();

    // Get all focusable elements within the modal
    const focusableElements = formRef.current?.querySelectorAll(
      'button, [href], input#react-select, select, textarea, [tabindex]:not([tabindex="-1"]):not(:disabled)'
    );

    const firstFocusableElement = focusableElements?.[0];

    const lastFocusableElement =
      focusableElements?.[focusableElements.length - 1];

    // If the shift key is pressed and the first element is focused, move focus to the last element
    if (event.shiftKey && document.activeElement === firstFocusableElement) {
      lastFocusableElement?.focus();

      return;
    }

    // If the shift key is not pressed and the last element is focused, move focus to the first element
    if (!event.shiftKey && document.activeElement === lastFocusableElement) {
      firstFocusableElement?.focus();
      return;
    }

    // Otherwise, move focus to the next element
    const direction = event.shiftKey ? -1 : 1;

    const index = Array.prototype.indexOf.call(
      focusableElements,

      document.activeElement
    );

    const nextElement = focusableElements?.[index + direction];

    if (nextElement) {
      nextElement?.focus();
    }
  };

  return (
    <Select
      inputRef={ref}
      inputId={name}
      name={name}
      styles={customStyles}
      className={`border rounded ${sizeClasses[size]}`}
      hideSelectedOptions={true}
      onKeyDown={handleTabChange}
      {...props}
    />
  );
});

export default MyReactSelect;
