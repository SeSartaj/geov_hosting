export function getRandomItem(arr) {
  if (arr.length === 0) return undefined; // Handle case for empty array
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
