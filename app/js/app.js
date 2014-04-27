define([
  "jquery",
  "requestAnimationFrame",
  "Stats",
  "mousetrap",
  "clock",
  "graphics",
  "glMatrix"
  ],
  function(
    ignore,
    ignore,
    ignore,
    ignore,
    ignore,
    Graphics,
    glm
  ) {

  var App = {

    stats: null,
    clock: null,

    mouse: {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      buttons: new Array(4)
    },

    camCtrlMode: false,

    init: function() {
      Graphics.init($("#webgl-canvas")[0]);
      this.clock = new Clock();
      this.setupKeyboard();

      // init stats
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.zIndex = 100;
      document.body.appendChild( this.stats.domElement );

      this.initMouse();

      this.update();
    },

    update: function() {
      requestAnimationFrame(App.update);
      App.mouseUpdate();
      Graphics.update(App.clock.getDelta());
      App.stats.update();
    },

    setupKeyboard: function() {

      // pause simulation time
      Mousetrap.bind("space", function() {
        Graphics.timeScale = Graphics.timeScale > 0.0 ?
          Graphics.timeScale = 0.0 : Graphics.timeScale = 1.0;
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

    initMouse: function() {
      // disable context menu
      document.oncontextmenu = function() { return false; };

      (function(self) {
        $(document).mousemove(function(event) {
          self.mouse.dx = event.pageX - self.mouse.x;
          self.mouse.dy = event.pageY - self.mouse.y;
          self.mouse.x = event.pageX;
          self.mouse.y = event.pageY;
        }).mousedown(function(event) {
          self.mouse.buttons[event.which] = true;
        }).mouseup(function(event) {
          self.mouse.buttons[event.which] = false;
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