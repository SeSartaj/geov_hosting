const getSelectedValues = (value, options) => {
  console.log('getSelectedValues', value, options);
  // if value is an array
  if (Array.isArray(value)) {
    // return an array for each item in arrat and call getSelectValue for it
    return value.map((v) => getSelectValue(v, options));
  }
  // if value is not an array, call getSelectValue for it
  return getSelectValue(value, options);
};

const getSelectValue = (value, options) => {
  // if options are there
  if (options && options.length > 0) {
    if (typeof value === 'object') {
      if (options.includes(value)) {
        // if value is present in options, set value to it
        return value;
      } else {
        // if value is not present in options, return options value where id is the same with value?.id
        return options.find(
          (o) =>
            o.value === value?.value ||
            o.value === value?.id ||
            o.value === value?.serial
        );
      }
    } else {
      // if type is not object, find option where value is equal to value
      return options.find((o) => o.value === value);
    }
  }
  // if the value is an object and has a title or name
  else if (
    typeof value === 'object' &&
    (value?.title || value?.name || value?.label) &&
    (value?.id || value?.serial)
  ) {
    // if options is null, then check if type of value is object,
    // if value has a title or name, and id propery make an option from it
    // device doesn't have id property, so we use serial
    return {
      value: value?.id || value?.serial,
      label: value.title || value?.name || value?.label,
    };
  } else if (value) {
    // if only id
    return { value: value, label: `id: ${value}` };
  }

  return null;
};

export default getSelectedValues;
