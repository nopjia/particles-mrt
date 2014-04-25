#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;
varying vec2 vUV;

uniform sampler2D uTexture0;

void main() {
  //gl_FragColor = vec4(texture2D(uTexture0, vUV).rgb, 1.0) * vColor;
  gl_FragColor = vColor;
}
