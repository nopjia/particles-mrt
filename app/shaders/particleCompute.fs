#extension GL_EXT_draw_buffers : require

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 uResolution;
uniform float uTime;
uniform float uDeltaT;
uniform sampler2D uTexture0;  // pos
uniform sampler2D uTexture1;  // vel
uniform sampler2D uTexture2;  // unused

void main() {
  vec2 uv = gl_FragCoord.xy/uResolution.xy;

  vec3 pos = texture2D(uTexture0, uv).rgb;
  vec3 vel = texture2D(uTexture1, uv).rgb;
  vec3 testVal = texture2D(uTexture2, uv).rgb;

  vec3 accel = vec3(1.0, 0.0, 0.0);

  // important, order matters
  // pos += vel * uDeltaT;
  // vel += accel * uDeltaT;

  pos.y += sin(uTime)/2.0 + 0.5;

  gl_FragData[0] = vec4(pos, 1.0);
  gl_FragData[1] = vec4(vel, 1.0);
  gl_FragData[2] = vec4(uv.x, uv.y, 0.0, 1.0);
}
