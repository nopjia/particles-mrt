#extension GL_EXT_draw_buffers : require

#ifdef GL_ES
precision highp float;
#endif

//---------------------------------------------------------
// MACROS
//---------------------------------------------------------

#define EPS         0.0001
#define PI          3.14159265
#define HALF_PI     1.57079633
#define ROOT_THREE  1.73205081

#define EQUALS(A,B) ( abs((A)-(B)) < EPS )
#define EQUALSZERO(A) ( ((A)<EPS) && ((A)>-EPS) )

#define K_GRAVITY   10.0
#define K_VEL_DECAY 0.99

//---------------------------------------------------------
// UNIFORMS
//---------------------------------------------------------

uniform vec2 uResolution;
uniform float uTime;
uniform float uDeltaT;
uniform vec3 uInputPos;
uniform float uKForce;
uniform sampler2D uTexture0;  // pos
uniform sampler2D uTexture1;  // vel
uniform sampler2D uTexture2;  // unused


//---------------------------------------------------------
// FUNCTIONS
//---------------------------------------------------------

// source: http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 seed) {
  return fract(sin(dot(seed.xy,vec2(12.9898,78.233))) * 43758.5453);
}

//---------------------------------------------------------
// MAIN
//---------------------------------------------------------

void main() {
  vec2 uv = gl_FragCoord.xy/uResolution.xy;

  // read data
  vec3 pos = texture2D(uTexture0, uv).rgb;
  vec3 vel = texture2D(uTexture1, uv).rgb;
  vec3 testVal = texture2D(uTexture2, uv).rgb;

  // compute force
  //vec3 gravityCenter = vec3(cos(uTime), sin(uTime), 0.0) * 0.25;
  vec3 toCenter = uInputPos - pos;
  float toCenterLength = length(toCenter);
  vec3 accel = (toCenter/toCenterLength) * uKForce / toCenterLength;

  // update particle
  // important, order matters
  pos += vel * uDeltaT;
  vel = K_VEL_DECAY * vel + accel * uDeltaT;

  // write out data
  gl_FragData[0] = vec4(pos, 1.0);
  gl_FragData[1] = vec4(vel, 1.0);
  gl_FragData[2] = texture2D(uTexture2, uv);
}
