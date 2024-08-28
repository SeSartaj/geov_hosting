export default function convertBoundsToBboxString(bounds) {
  const bbox = [
    bounds.getWest(),
    bounds.getSouth(),
    bounds.getEast(),
    bounds.getNorth(),
  ];

  return bbox.join(',');
}
