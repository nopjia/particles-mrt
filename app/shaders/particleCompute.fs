#extension GL_EXT_draw_buffers : require

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 uResolution;
uniform sampler2D uTexture0;

void main() {
  vec2 uv = gl_FragCoord.xy/uResolution.xy;
  gl_FragColor = vec4(uv.x, uv.y, 0.0, 1.0);
}
