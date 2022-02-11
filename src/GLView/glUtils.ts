import { mat4 } from 'gl-matrix';

export type GLContext = WebGLRenderingContext | WebGL2RenderingContext

export function initAttrib(
  gl: GLContext, buffer: any, bufferType: any, vertex: any, number: any, type: any, normalize: any, stride: any, offset: any
) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(vertex, number, type, normalize, stride, offset);
  gl.enableVertexAttribArray(vertex);
}

export function createBuffer(gl: GLContext, array: any, type: GLenum, dataClass: any, method: GLenum) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, new dataClass(array), method);
  return buffer;
}


export function getContext(canvas: HTMLCanvasElement): GLContext | undefined {
  const gl = canvas.getContext('webgl');

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
  return gl;
}

export function createProgramInfo(gl: GLContext, program: WebGLProgram, vertArray: string[], uniformArray: string[]) {
  return {
    program,
    attribLocations: Object.fromEntries(vertArray.map((name: string) => [name, gl.getAttribLocation(program, name)])),
    uniformLocations: Object.fromEntries(uniformArray.map((name: string) => [name, gl.getUniformLocation(program, name)]))
  };
}

export function beginRender(gl: GLContext) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function degree45Project(gl: GLContext) {

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar);
  return projectionMatrix;
}

export function glattr(program: WebGLProgram, name: string, gl: GLContext) {
  return gl.getAttribLocation(program, name);
}

export function list(obj: any) {
  return Object.entries(obj);
}
