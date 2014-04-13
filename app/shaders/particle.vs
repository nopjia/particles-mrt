#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aPosition;
attribute vec4 aColor;

varying vec4 vColor;

uniform mat4 uModelMat;
uniform mat4 uViewMat;
uniform mat4 uProjectionMat;

void main() {
  // vec3 mvPosition = texture2D(posTex, position.xy).rgb;
  
  // gl_PointSize = 1.0;

  vColor = aColor;

  gl_Position = uProjectionMat * uViewMat * uModelMat * vec4(aPosition, 1.0);
}