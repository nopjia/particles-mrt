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

#define K_GRAVITY 1.0
#define K_UBYTE_UNPACK_RANGE 1.0


//---------------------------------------------------------
// UNIFORMS
//---------------------------------------------------------

uniform vec2 uResolution;
uniform float uTime;
uniform float uDeltaT;
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

vec3 unpackUByte(vec3 value) {
  return value * 2.0*K_UBYTE_UNPACK_RANGE - K_UBYTE_UNPACK_RANGE;
}

vec3 packUByte(vec3 value) {
  return (value + K_UBYTE_UNPACK_RANGE) / (2.0*K_UBYTE_UNPACK_RANGE);
}

//---------------------------------------------------------
// MAIN
//---------------------------------------------------------

void main() {
  vec2 uv = gl_FragCoord.xy/uResolution.xy;

  if (uTime < 0.1) {
    vec3 pos = vec3(uv.x, uv.y, rand(uv)) * 0.5 + 0.1;
    gl_FragData[0] = vec4(pos, 1.0);
    gl_FragData[1] = vec4(0.5, 0.5, 0.5, 1.0);
  }
  else {
    // read data
    vec3 pos = texture2D(uTexture0, uv).rgb;
    vec3 vel = unpackUByte( texture2D(uTexture1, uv).rgb );
    vec3 testVal = texture2D(uTexture2, uv).rgb;

    // compute force

    vec3 gravityCenter = vec3(0.5, 0.5, 0.5);
    vec3 toCenter = gravityCenter - pos;
    float toCenterLength = length(toCenter);
    vec3 accel = (toCenter/toCenterLength) * K_GRAVITY / toCenterLength;
    //accel = vec3(0.0, -K_GRAVITY, 0.0);


    // update particle
    // important, order matters
    pos += vel * uDeltaT;
    vel += accel * uDeltaT;

    // wrap around
    pos = fract(pos);

    // write out data
    gl_FragData[0] = vec4(pos, 1.0);
    gl_FragData[1] = vec4(packUByte(vel), 1.0);
  }
  //gl_FragData[2] = vec4(uv.x, uv.y, rand(uv), 1.0);
}
