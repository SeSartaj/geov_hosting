export default function InlineInputField({ label, children }) {
  return (
    <div className='inline-flex items-center space-x-2'>
      <label className='text-gray-800 dark:text-gray-300'>{label}</label>
      {children}
    </div>
  );
}
