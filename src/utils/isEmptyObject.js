export default function isEmptyObject(obj) {
  if (!obj) throw new Error('parameter is not an object', obj);
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
