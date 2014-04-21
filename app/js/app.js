define([
  "jquery",
  "shortcut",
  "graphics",
  "requestAnimationFrame",
  "clock"
  ],
  function(
    ignore,
    shortcut,
    g
  ) {

  var setupShortcuts = function() {
    shortcut.add("space", function() {
      g.timeScale = g.timeScale > 0.0 ? g.timeScale = 0.0 : g.timeScale = 1.0;
    });
  };

  var App = {

    clock: null,

    init: function() {
      g.init($("#webgl-canvas")[0]);
      clock = new Clock();
      setupShortcuts();

      this.update();
    },

    update: function() {
      requestAnimationFrame(App.update);
      g.update(clock.getDelta());
    }

  };

  return App;
});