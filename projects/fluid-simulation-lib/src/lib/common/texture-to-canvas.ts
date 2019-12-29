
export function textureToCanvas(texture, width, height) {
  const captureCanvas = document.createElement('canvas');
  const ctx = captureCanvas.getContext('2d');
  captureCanvas.width = width;
  captureCanvas.height = height;

  const imageData = ctx.createImageData(width, height);
  imageData.data.set(texture);
  ctx.putImageData(imageData, 0, 0);

  return captureCanvas;
}
