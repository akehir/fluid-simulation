import { Context } from './context';
import { compileShader } from './compile-shader';
import {
  advectionShaderSource,
  baseVertexShaderSource,
  bloomBlurShaderSource,
  bloomFinalShaderSource,
  bloomPrefilterShaderSource,
  blurShaderSource,
  blurVertexShaderSource,
  checkerboardShaderSource,
  clearShaderSource,
  colorShaderSource,
  copyShaderSource,
  curlShaderSource,
  displayShaderSource,
  divergenceShaderSource,
  gradientSubtractShaderSource,
  pressureShaderSource,
  splatShaderSource,
  sunraysMaskShaderSource,
  sunraysShaderSource,
  vorticityShaderSource
} from './predefined-shader-sources';


export const baseVertexShader = (gl: Context, ext?) => compileShader(gl, gl.VERTEX_SHADER, baseVertexShaderSource);

export const blurVertexShader = (gl: Context, ext?) => compileShader(gl, gl.VERTEX_SHADER, blurVertexShaderSource);

export const blurShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, blurShaderSource);

export const copyShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, copyShaderSource);

export const clearShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, clearShaderSource);

export const colorShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, colorShaderSource);

export const checkerboardShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, checkerboardShaderSource);

export const displayShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, displayShaderSource);

export const bloomPrefilterShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, bloomPrefilterShaderSource);

export const bloomBlurShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, bloomBlurShaderSource);

export const bloomFinalShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, bloomFinalShaderSource);

export const sunraysMaskShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, sunraysMaskShaderSource);

export const sunraysShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, sunraysShaderSource);

export const splatShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, splatShaderSource);

export const advectionShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, advectionShaderSource,
  ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']
);

export const divergenceShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, divergenceShaderSource);

export const curlShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, curlShaderSource);

export const vorticityShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, vorticityShaderSource);

export const pressureShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, pressureShaderSource);

export const gradientSubtractShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, gradientSubtractShaderSource);
