import { Context } from './context';

export function framebufferToTexture(target, gl: Context) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
  const length = target.width * target.height * 4;
  const texture = new Float32Array(length);
  gl.readPixels(0, 0, target.width, target.height, gl.RGBA, gl.FLOAT, texture);
  return texture;
}
