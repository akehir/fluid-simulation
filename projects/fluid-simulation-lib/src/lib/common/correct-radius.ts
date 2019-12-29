export function correctRadius(canvas: HTMLCanvasElement, radius) {
  const aspectRatio = canvas.width / canvas.height;
  if (aspectRatio > 1) {
    radius *= aspectRatio;
  }
  return radius;
}
