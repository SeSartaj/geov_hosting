export default function Label({ children, className }) {
  return (
    <label
      className={`text-gray-800 dark:text-gray-300 ${
        className ? className : ''
      }`}
    >
      {children}
    </label>
  );
}
