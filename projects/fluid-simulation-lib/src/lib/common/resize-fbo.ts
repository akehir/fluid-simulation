import { Context } from './context';
import { createFBO } from './create-fbo';
import { Program } from './program';

export function resizeFBO(gl: Context, blit, copyProgram: Program, target, w, h, internalFormat, format, type, param) {
  const newFBO = createFBO(gl, w, h, internalFormat, format, type, param);
  copyProgram.bind();
  gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
  blit(newFBO.fbo); // todo: check
  return newFBO;
}
