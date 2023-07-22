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


export const baseVertexShader = (gl: Context) => compileShader(gl, gl.VERTEX_SHADER, baseVertexShaderSource);

export const blurVertexShader = (gl: Context) => compileShader(gl, gl.VERTEX_SHADER, blurVertexShaderSource);

export const blurShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, blurShaderSource);

export const copyShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, copyShaderSource);

export const clearShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, clearShaderSource);

export const colorShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, colorShaderSource);

export const checkerboardShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, checkerboardShaderSource);

export const displayShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, displayShaderSource);

export const bloomPrefilterShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, bloomPrefilterShaderSource);

export const bloomBlurShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, bloomBlurShaderSource);

export const bloomFinalShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, bloomFinalShaderSource);

export const sunraysMaskShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, sunraysMaskShaderSource);

export const sunraysShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, sunraysShaderSource);

export const splatShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, splatShaderSource);

export const advectionShader = (gl: Context, ext?) => compileShader(gl, gl.FRAGMENT_SHADER, advectionShaderSource,
  ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']
);

export const divergenceShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, divergenceShaderSource);

export const curlShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, curlShaderSource);

export const vorticityShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, vorticityShaderSource);

export const pressureShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, pressureShaderSource);

export const gradientSubtractShader = (gl: Context) => compileShader(gl, gl.FRAGMENT_SHADER, gradientSubtractShaderSource);
