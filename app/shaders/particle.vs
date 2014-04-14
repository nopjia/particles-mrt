#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aPosition;
attribute vec4 aColor;
attribute vec2 aUV;

varying vec4 vColor;
varying vec2 vUV;

uniform mat4 uModelMat;
uniform mat4 uViewMat;
uniform mat4 uProjectionMat;
uniform sampler2D uTexture0;

void main() {
  // vec3 mvPosition = texture2D(posTex, position.xy).rgb;
  
  // gl_PointSize = 1.0;

  vColor = aColor;
  vUV = aUV;

  gl_Position = uProjectionMat * uViewMat * uModelMat * vec4(aPosition, 1.0);
}