import { getSupportedFormat } from './get-supported-format';
import { getMockWebGlContext } from "./get-mock-web-gl-context";

export function getWebGLContext(canvas: HTMLCanvasElement) {
  const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };

  let gl: WebGL2RenderingContext = canvas.getContext('webgl2', params) as WebGL2RenderingContext;
  const isWebGL2 = !!gl;
  if (!isWebGL2) { // todo: this typecast is not true, but we're tricking typescript here
    gl = canvas.getContext('webgl', params) as WebGL2RenderingContext
      || canvas.getContext('experimental-webgl', params) as WebGL2RenderingContext;
  }


  if(!gl) {
    gl = getMockWebGlContext();
  }

  let halfFloat;
  let supportLinearFiltering;
  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float');
    supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
  } else {
    halfFloat = gl.getExtension('OES_texture_half_float');
    supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
  let formatRGBA;
  let formatRG;
  let formatR;

  if (isWebGL2) {
    formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
    formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
  } else {
    formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
  }

  return {
    gl,
    ext: {
      formatRGBA,
      formatRG,
      formatR,
      halfFloatTexType,
      supportLinearFiltering
    }
  };
}
