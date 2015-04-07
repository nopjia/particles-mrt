# MRT Particles

Simulating 1 million particles on WebGL shaders with multiple render targets

Live demo: [iamnop.com/particles-mrt](http://iamnop.com/particles-mrt)

Blog: http://nopjia.blogspot.com/2014/06/webgl-gpu-particles.html

![screenshot](http://4.bp.blogspot.com/-O8wDJwftREw/U5TT7H7nzEI/AAAAAAAABOc/8ACW4NA9MXo/s1600/webgl-particles-11.png)

## Requirements

This demo requires the `OES_texture_float` and `WEBGL_draw_buffers` extensions. Please check at http://webglreport.com/ to see which extensions are supported by your browser. 

If you do not have the extensions supported, you can try:

1. Get the latest version of Chrome
1. Go to chrome://flags/
1. Enable "WebGL Draft Extensions" (chrome://flags/#enable-webgl-draft-extensions)
1. For Windows, you might also need to enable D3D11 (chrome://flags/#enable-d3d11)

## Controls

* Click - set gravity point
* Space - pause
* Alt+Click - rotate/zoom/pan camera
* Shift+R - reset camera

---
Copyright © 2015 Nop Jiarathanakul
