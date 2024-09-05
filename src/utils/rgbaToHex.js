export default function rgbToHex(rgba) {
  const [r, g, b] = rgba;

  // Convert the RGBA values to 0-255 range (if necessary)
  const rHex = Math.round(r).toString(16).padStart(2, '0');
  const gHex = Math.round(g).toString(16).padStart(2, '0');
  const bHex = Math.round(b).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}
