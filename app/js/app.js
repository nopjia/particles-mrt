define([
  "jquery",
  "requestAnimationFrame",
  "Stats",
  "mousetrap",
  "clock",
  "graphics"
  ],
  function(
    ignore,
    ignore,
    ignore,
    ignore,
    ignore,
    Graphics
  ) {

  var setupKeyboard = function() {
    Mousetrap.bind("space", function() {
      Graphics.timeScale = Graphics.timeScale > 0.0 ?
        Graphics.timeScale = 0.0 : Graphics.timeScale = 1.0;
    });
  };

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

    init: function() {
      Graphics.init($("#webgl-canvas")[0]);
      this.clock = new Clock();
      setupKeyboard();

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
          console.log(self.mouse.buttons);
        }).mouseup(function(event) {
          self.mouse.buttons[event.which] = false;
          console.log(self.mouse.buttons);
        });
      })(this);
    },

    mouseUpdate: function() {
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

      this.mouse.dx = 0.0;
      this.mouse.dy = 0.0;
    }

  };

  return App;
});