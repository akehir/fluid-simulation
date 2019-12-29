export function getTextureScale(texture, width, height) {
  return {
    x: width / texture.width,
    y: height / texture.height
  };
}

