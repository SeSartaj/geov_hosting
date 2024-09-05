export default function debounce(func, delay = 100) {
  let timeoutId;

  const debouncedFunction = function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };

  debouncedFunction.cancel = function () {
    clearTimeout(timeoutId);
  };

  return debouncedFunction;
}
