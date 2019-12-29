import { Context } from './context';

export type Shader = (gl: Context, ext?) => WebGLShader;
