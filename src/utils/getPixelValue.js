import rgbToHex from './rgbaToHex';

export default function getPixelValue(layerId, pixelValue) {
  if (layerId === 'NDVI_RAW') {
    // value is encoded in green band on the sentinal hub's evalscript
    // for NDVI_RAW layer
    const ndvi = pixelValue[1] / 127.5 - 1;
    return {
      label: 'NDVI',
      value: ndvi.toFixed(2),
      color: rgbToHex(pixelValue),
    };
  }

  return {
    label: 'color',
    value: null,
    color: rgbToHex(pixelValue),
  };
}
