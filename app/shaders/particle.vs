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
  vColor = vec4(1.0, 1.0, 0.0, 0.1);//aColor;
  vUV = aUV;

  gl_PointSize = 3.0;

  vec3 pos = texture2D(uTexture0, vUV).rgb * 5.0;

  gl_Position = 
    uProjectionMat * uViewMat * uModelMat *
    vec4(pos, 1.0);
}