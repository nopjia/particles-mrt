define([
  "jquery",
  "requestAnimationFrame",
  "Stats",
  "mousetrap",
  "clock",
  "graphics",
  "utils",
  "glMatrix",
  "datGUI"
  ],
  function(
    ignore,
    ignore,
    ignore,
    ignore,
    ignore,
    Graphics,
    Utils,
    glm,
    GUI   // TODO: fix this
  ) {

  var App = {

    canvas: null,
    stats: null,
    clock: null,
    gui: null,
    guiParams: null,

    mouse: {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      buttons: new Array(4)
    },

    camCtrlMode: false,

    init: function() {
      this.canvas = $("#webgl-canvas")[0];
      Graphics.init(this.canvas);
      this.clock = new Clock();

      // init stats
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.zIndex = 100;
      document.body.appendChild( this.stats.domElement );

      this.initKeyboard();
      this.initMouse();
      this.initGUI();

      this.update();
    },

    update: function() {
      requestAnimationFrame(App.update);
      App.mouseUpdate();
      Graphics.update(App.clock.getDelta());
      App.stats.update();
    },

    initKeyboard: function() {

      // pause simulation time
      Mousetrap.bind("space", function() {
        Graphics.paused = !Graphics.paused;
      });

      // reset camera
      Mousetrap.bind("shift+r", function() {
        Graphics.cameraControls.reset();
        Graphics.cameraControls.radius = 5.0;
      });

      // control mode
      (function(self) {
        Mousetrap.bind("alt", function() {
          self.camCtrlMode = true;
          return false;
        }, "keydown");
        Mousetrap.bind("alt", function() {
          self.camCtrlMode = false;
          return false;
        }, "keyup");
      })(this);

    },

    initGUI: function() {
      this.guiParams = {
        amount: 512,
        size: 1,
        color: [255, 76, 25],
        alpha: 0.5,
        gravity: 10.0,
        drag: 0.01,
        screenshot: function() {
          Graphics.gl.clearColor(0.0, 0.0, 0.0, 1.0);
          Graphics.draw();
          Utils.screenshotToNewWindow($("#webgl-canvas")[0]);
          Graphics.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        },
        reset: function() {
          Graphics.drawParticleInit();
        }
      };

      this.gui = new dat.GUI();

      // this.gui.add(this.guiParams, "Amount", {
      //   "16 K": 128,
      //   "65 K": 256,
      //   "260 K": 512,
      //   "1 M": 1024,
      //   "4 M": 2048
      // });
      // this.gui.add(this.guiParams, "Size", 0, 10);
      this.gui.addColor(this.guiParams, "color").onChange(function(value) {
        if (value[0] === "#") value = Utils.hexToRgb(value);
        Graphics.shaders.particle.uniforms.uColor.value[0] = value[0] / 255.0;
        Graphics.shaders.particle.uniforms.uColor.value[1] = value[1] / 255.0;
        Graphics.shaders.particle.uniforms.uColor.value[2] = value[2] / 255.0;
      });
      this.gui.add(this.guiParams, "alpha", 0, 1).onChange(function(value) {
        Graphics.shaders.particle.uniforms.uColor.value[3] = value;
      });
      this.gui.add(this.guiParams, "gravity", 0, 50).onFinishChange(function(value) {
        Graphics.shaders.particleCompute.uniforms.uKForce.value = value;
      });
      this.gui.add(Graphics, "paused").listen();
      this.gui.add(this.guiParams, "screenshot");
      this.gui.add(this.guiParams, "reset");
    },

    initMouse: function() {
      var dom = this.canvas;

      dom.oncontextmenu = function() { return false; };

      (function(self) {
        $(dom).mousemove(function(event) {
          self.mouse.dx = event.pageX - self.mouse.x;
          self.mouse.dy = event.pageY - self.mouse.y;
          self.mouse.x = event.pageX;
          self.mouse.y = event.pageY;
          event.preventDefault();
        }).mousedown(function(event) {
          self.mouse.buttons[event.which] = true;
          event.preventDefault();
        }).mouseup(function(event) {
          self.mouse.buttons[event.which] = false;
          event.preventDefault();
        });
      })(this);
    },

    mouseUpdate: function() {
      // test moving gravity
      if (!this.camCtrlMode) {
        if (this.mouse.buttons[1]) {
          var u = this.mouse.x / Graphics.width;
          var v = 1.0 - (this.mouse.y / Graphics.height);
          var point = Graphics.camera.getPointOnTargetPlane(u,v);
          Graphics.shaders.particleCompute.uniforms.uInputPos.value = point;
        }
      }
      else {
        // camera controls
        if (this.mouse.buttons[1]) {
          var K_ROTATE = -0.01;
          Graphics.cameraControls.rotate(K_ROTATE*this.mouse.dx, K_ROTATE*this.mouse.dy);
        }
        else if (this.mouse.buttons[2]) {
          var K_PAN = 0.1;
          Graphics.cameraControls.pan(-K_PAN*this.mouse.dx, K_PAN*this.mouse.dy);
        }
        else if (this.mouse.buttons[3]) {
          var K_ZOOM = 0.1;
          Graphics.cameraControls.zoom(K_ZOOM*this.mouse.dy);
        }
      }

      this.mouse.dx = 0.0;
      this.mouse.dy = 0.0;
    }

  };

  return App;
});