import { resizeFBO } from './resize-fbo';
import { createFBO } from './create-fbo';
import { Context } from './context';
import { Program } from './program';

export function resizeDoubleFBO(gl: Context, blit, copyProgram: Program, target, w, h, internalFormat, format, type, param) {
  if (target.width === w && target.height === h) {
    return target;
  }
  target.read = resizeFBO(gl, blit, copyProgram, target.read, w, h, internalFormat, format, type, param);
  target.write = createFBO(gl, w, h, internalFormat, format, type, param);
  target.width = w;
  target.height = h;
  target.texelSizeX = 1.0 / w;
  target.texelSizeY = 1.0 / h;
  return target;
}
