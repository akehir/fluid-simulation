import { hashCode } from './hash-code';
import { Context } from './context';
import { Shader } from './shader';
import { compileShader } from './compile-shader';
import { createProgram } from './create-program';
import { getUniforms } from './get-uniforms';
import { displayShaderSource } from './predefined-shader-sources';

export class Material {
  private readonly gl: Context;
  private readonly programs: WebGLProgram[];
  private readonly vertexShader: Shader;
  private activeProgram: WebGLProgram;
  public uniforms;

  constructor(gl: Context, vertexShader: Shader) {
    this.vertexShader = vertexShader;
    this.programs = [];
    this.activeProgram = null;
    this.uniforms = [];
    this.gl = gl;
  }

  setKeywords(keywords) {
    let hash = 0;
    for (let i = 0; i < keywords.length; i++) { // eslint-disable-line
      hash += hashCode(keywords[i]);
    }

    let program = this.programs[hash];
    if (program == null) {
      const fragmentShader = (gl) => compileShader(gl, gl.FRAGMENT_SHADER, displayShaderSource, keywords);
      program = createProgram(this.gl, this.vertexShader, fragmentShader);
      this.programs[hash] = program; // converting from WebGLProgram to custom Program
    }

    if (program === this.activeProgram) { return; }

    this.uniforms = getUniforms(this.gl, program);
    this.activeProgram = program;
  }

  bind() {
    this.gl.useProgram(this.activeProgram);
  }
}
