export default function isDrawingMode(drawRef) {
  const drawInstance = drawRef?.current;
  // Check if the drawRef is valid
  if (!drawRef || !drawInstance) {
    console.error('drawRef is not defined.');
    return false;
  }

  // Get the current mode
  const currentMode = drawInstance.getMode();

  // Check if the draw mode is active
  if (currentMode.startsWith('draw_')) {
    return true;
  }

  // Check if there are any features in the draw instance
  const features = drawInstance.getAll().features;
  if (features.length > 0) {
    return true;
  }

  // If not in draw mode and no features, return false
  return false;
}
