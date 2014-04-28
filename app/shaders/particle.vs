#ifdef GL_ES
precision highp float;
#endif

attribute vec2 aUV;

varying vec4 vColor;

uniform mat4 uViewProjMat;
uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

void main() {
  gl_PointSize = 1.0;

  vColor = texture2D(uTexture2, aUV);

  vec3 pos = texture2D(uTexture0, aUV).rgb;

  gl_Position = uViewProjMat * vec4(pos, 1.0);
}