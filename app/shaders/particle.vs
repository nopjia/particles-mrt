#ifdef GL_ES
precision highp float;
#endif

attribute vec2 aUV;

varying vec4 vColor;

uniform mat4 uViewProjMat;
uniform vec4 uColor;
uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

void main() {
  gl_PointSize = 1.0;

  //vColor = texture2D(uTexture2, aUV);
  //vColor = vec4(1.0, 0.3, 0.1, 0.5);

  gl_Position = uViewProjMat * texture2D(uTexture0, aUV);
}