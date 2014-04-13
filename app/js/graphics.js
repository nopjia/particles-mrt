define([
  "utils",
  "Stats",
  "glMatrix"
  ],
  function(
    Utils
  ) {

  var gl = null;

  var modelMat = mat4.create();
  mat4.identity(modelMat);

  var Graphics = {
    CAM_FOV: 45,
    CAM_NEAR: 1,
    CAM_FAR: 1000,

    canvas: null,
    width: -1,
    height: -1,

    shaders: {
      particle: {
        vsFileName: "shaders/particle.vs",
        fsFileName: "shaders/particle.fs",
        attributes: {
          aPosition: {},
          aColor: {},
        },
        uniforms: {
          uModelMat: { value: null },
          uViewMat: { value: null },
          uProjectionMat: { value: null },
        }
      }
    },

    vertexBuffers: {
      particlePos: {
        size: 3,
        count: 3,
        vertices: new Float32Array([
          0.0,  1.0,  0.0,
         -1.0, -1.0,  0.0,
          1.0, -1.0,  0.0
        ])
      },
      particleCol: {
        size: 4,
        count: 3,
        vertices: new Float32Array([
          1.0, 0.0, 0.0, 1.0,
          0.0, 1.0, 0.0, 1.0,
          0.0, 0.0, 1.0, 1.0
        ])
      }
    },

    projectionMat: mat4.create(),
    viewMat: mat4.create(),

    init: function(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.offsetWidth;
      this.height = this.canvas.offsetHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      // init stats
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.zIndex = 100;
      document.body.appendChild( this.stats.domElement );

      (function(self) {
        window.addEventListener(
          'resize', function() {self.onWindowResize();}, false
        );
      })(this);

      this.initGL();
      this.initShaders();
      this.initBuffers();
      this.draw();
    },

    initGL: function() {
      try {
        gl = this.canvas.getContext("experimental-webgl");
      } catch (e) {
      }
      if (!gl) {
        console.error("Your browser does not support WebGL.");
        return false;
      }

      gl.viewport(0, 0, this.width, this.height);
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.enable(gl.DEPTH_TEST);
    },

    compileShader: function(shader) {

      // compile vertex shader
      var vsScript = Utils.loadTextFile(shader.vsFileName);
      shader.vsShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(shader.vsShader, vsScript);
      gl.compileShader(shader.vsShader);
      if (!gl.getShaderParameter(shader.vsShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader.vsShader));
        return false;
      }

      // compile fragment shader
      var fsScript = Utils.loadTextFile(shader.fsFileName);
      shader.fsShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(shader.fsShader, fsScript);
      gl.compileShader(shader.fsShader);
      if (!gl.getShaderParameter(shader.fsShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader.fsShader));
        return false;
      }

      // link shaders
      shader.program = gl.createProgram();
      gl.attachShader(shader.program, shader.vsShader);
      gl.attachShader(shader.program, shader.fsShader);
      gl.linkProgram(shader.program);

      if (!gl.getProgramParameter(shader.program, gl.LINK_STATUS)) {
        console.error("Cannot link shaders");
        return false;
      }

      // get attribute and uniform locations
      for (var attributeName in shader.attributes) {
        shader.attributes[attributeName].location = gl.getAttribLocation(shader.program, attributeName);
      }
      for (var uniformName in shader.uniforms) {
        shader.uniforms[uniformName].location = gl.getUniformLocation(shader.program, uniformName);
      }

    },

    initShaders: function() {
      for (var shaderName in this.shaders) {
        this.compileShader(this.shaders[shaderName]);
        console.log(this.shaders[shaderName]);
      }
    },

    prepareVertexBuffer: function(vb) {
      vb.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vb.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vb.vertices, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    },

    initBuffers: function() {
      for (var vbName in this.vertexBuffers) {
        this.prepareVertexBuffer(this.vertexBuffers[vbName]);
      }
    },

    update: function(elapsedTime) {
      this.stats.update();

      // perspective
      mat4.perspective(this.projectionMat, 45, this.width / this.height, 0.1, 100.0);

      // camera
      mat4.identity(this.viewMat);
      mat4.translate(this.viewMat, this.viewMat, [0.0, 0.0, -5.0]);

      for (var shaderName in this.shaders) {
        var shader = this.shaders[shaderName];

        shader.uniforms.uProjectionMat.value = this.projectionMat;
        shader.uniforms.uViewMat.value = this.viewMat;

        gl.useProgram(shader.program);
        gl.uniformMatrix4fv(shader.uniforms.uProjectionMat.location, false, shader.uniforms.uProjectionMat.value);
        gl.uniformMatrix4fv(shader.uniforms.uViewMat.location, false, shader.uniforms.uViewMat.value);
        gl.useProgram(null);
      }

      // test animate
      mat4.rotateY(modelMat, modelMat, 0.1);

      this.draw();
    },

    draw: function() {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      gl.useProgram(this.shaders.particle.program);
      gl.uniformMatrix4fv(this.shaders.particle.uniforms.uModelMat.location, false, modelMat);

      gl.enableVertexAttribArray(this.shaders.particle.attributes.aPosition.location);
      gl.enableVertexAttribArray(this.shaders.particle.attributes.aColor.location);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers.particlePos.buffer);
      gl.vertexAttribPointer(
        this.shaders.particle.attributes.aPosition.location,
        this.vertexBuffers.particlePos.size, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers.particleCol.buffer);
      gl.vertexAttribPointer(
        this.shaders.particle.attributes.aColor.location,
        this.vertexBuffers.particleCol.size, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, this.vertexBuffers.particlePos.count);

      gl.disableVertexAttribArray(this.shaders.particle.attributes.aPosition.location);
      gl.disableVertexAttribArray(this.shaders.particle.attributes.aColor.location);

      gl.useProgram(null);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    },

    onWindowResize: function() {
      this.width = this.canvas.offsetWidth;
      this.height = this.canvas.offsetHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      gl.viewport(0, 0, this.width, this.height);
    }
  };

  return Graphics;
});