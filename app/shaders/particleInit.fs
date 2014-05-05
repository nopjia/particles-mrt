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

  vec3 pos = vec3(uv.x, uv.y, rand(uv));
  vec3 vel = vec3(-2.0, 0.0, 0.0);
  vec4 col = vec4(1.0, 0.3, 0.1, 0.5);

  // if (uv.x < 0.5) {
  //   pos = vec3(2.0*uv.x, uv.y+0.5, rand(uv));
  //   vel = vec3(-2.0, 0.0, 0.0);
  //   col = vec4(1.0, 0.3, 0.1, 0.5);
  // }
  // else {
  //   pos = vec3(2.0*(uv.x-0.5)-1.0, uv.y+0.5, rand(uv));
  //   vel = vec3(2.0, 0.0, 0.0);
  //   col = vec4(0.1, 0.3, 1.0, 0.5);
  // }

  gl_FragData[0] = vec4(pos, 1.0);
  gl_FragData[1] = vec4(vel, 1.0);
  gl_FragData[2] = col;
}