export default function getBottomMostLayer(mapRef, layerIds) {
  if (!mapRef?.current) return null;
  const layers = mapRef?.current?.getStyle().layers;

  console.log('all Layers', layers);

  let bottomMostLayerId = null;
  let maxPosition = -1;

  // Iterate through the layers and directly find the bottom-most layer
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];

    // Check if the current layer is in the provided layerIds
    if (layerIds.includes(layer.id)) {
      if (i > maxPosition) {
        bottomMostLayerId = layer.id;
        maxPosition = i;
      }
    }
  }

  console.log('bottomMostLayer', bottomMostLayerId);

  return bottomMostLayerId;
}
