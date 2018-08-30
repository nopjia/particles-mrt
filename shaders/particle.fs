#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;

uniform vec4 uColor;

void main() {
  //gl_FragColor = vColor;
  gl_FragColor = uColor;
}
