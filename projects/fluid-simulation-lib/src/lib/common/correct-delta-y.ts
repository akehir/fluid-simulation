export function correctDeltaY(canvas: HTMLCanvasElement, delta) {
  const aspectRatio = canvas.width / canvas.height;
  if (aspectRatio > 1) { delta /= aspectRatio; }
  return delta;
}
