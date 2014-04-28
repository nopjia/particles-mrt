#extension GL_EXT_draw_buffers : require

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 uResolution;

// source: http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 seed) {
  return fract(sin(dot(seed.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy/uResolution.xy;
  gl_FragData[0] = vec4(uv.x, uv.y, rand(uv), 1.0);
  gl_FragData[1] = vec4(-2.0, 0.0, 0.0, 1.0);
  gl_FragData[2] = vec4(0.0, 0.0, 0.0, 1.0);
}