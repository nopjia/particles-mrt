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

      this.update();
    },

    update: function() {
      requestAnimationFrame(App.update);
      Graphics.update(App.clock.getDelta());
      App.stats.update();
    }

  };

  return App;
});