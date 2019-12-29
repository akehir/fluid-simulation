export function wrap(value, min, max) {
  const range = max - min;
  if (range === 0) { return min; }
  return (value - min) % range + min;
}
