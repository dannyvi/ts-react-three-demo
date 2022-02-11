import React from 'react'
import GLView from 'GLView'
// import onContextCreate from './cube'
import { createBuffer, degree45Project, getContext, glattr, GLContext, initAttrib } from 'GLView/glUtils';
import { mat4 } from 'gl-matrix';

const vsSource = `
    attribute vec4 position;
    attribute vec4 color;
    
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    
    varying lowp vec4 vColor;
    
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * position;
      vColor = color;
    }
  `;

const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;

function Cube(canvas: HTMLCanvasElement) {

  const gl = getContext(canvas) as GLContext;

  const vertexes = {
    position: [
      1.0, 1.0,
      -1.0, 1.0,
      1.0, -1.0,
      -1.0, -1.0,
    ],
    color: [
      1.0, 1.0, 1.0, 1.0,    // white
      1.0, 0.0, 0.0, 1.0,    // red
      0.0, 1.0, 0.0, 1.0,    // green
      0.0, 0.0, 1.0, 1.0,    // blue
    ]
  };
  const vertList = Object.entries(vertexes);

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource) as WebGLShader;
  gl.useProgram(shaderProgram);

  const buffers = vertList.map(([_, value]) => createBuffer(gl, value, gl.ARRAY_BUFFER, Float32Array, gl.STATIC_DRAW));
  const attrs = vertList.map(([name, _]) => glattr(shaderProgram, name, gl));
  const numbers = [2, 4];
  buffers.map((buffer, index) => initAttrib(gl, buffer, gl.ARRAY_BUFFER, attrs[index], numbers[index], gl.FLOAT, false, 0, 0));


  const matrixNames = ['projectionMatrix', 'modelViewMatrix'];
  const mats = matrixNames.map(name => gl.getUniformLocation(shaderProgram, name));
  const projectionMat = degree45Project(gl);
  const modelViewMat = mat4.create();
  mat4.translate(modelViewMat, modelViewMat, [-0.0, 0.0, -6.0]);
  var squareRotation = 0.0;
  mat4.rotate(modelViewMat, modelViewMat, squareRotation, [0, 0, 1]);
  mats.map((mat, index) => gl.uniformMatrix4fv(mat, false, [projectionMat, modelViewMat][index]));

  var then = 0;

  // Draw the scene repeatedly
  function render(now: any) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  function drawScene(deltaTime: any) {
    // squareRotation += deltaTime;
    mat4.rotate(modelViewMat, modelViewMat, deltaTime, [0, 0, 1]);
    gl.uniformMatrix4fv(mats[1], false, modelViewMat);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}


function initShaderProgram(gl: GLContext, vsSource: any, fsSource: any) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource) as WebGLShader;
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource) as WebGLShader;

  const shaderProgram = gl.createProgram() as WebGLProgram;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function loadShader(gl: GLContext, type: any, source: any) {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function BasicShader() {
  return <GLView onContextCreate={Cube}/>
}
