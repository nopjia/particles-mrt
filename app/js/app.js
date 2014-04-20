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

  var App = {

    clock: null,

    init: function() {
      g.init($("#webgl-canvas")[0]);
      clock = new Clock();
      this.update();
    },

    update: function() {
      requestAnimationFrame(App.update);
      g.update(clock.getDelta());
    }

  };

  return App;
});