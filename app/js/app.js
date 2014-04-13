define([
  "jquery",
  "shortcut",
  "graphics",
  "requestAnimationFrame"
  ],
  function(
    ignore,
    shortcut,
    g
  ) {

  var App = {

    stats: null,

    init: function() {
      g.init($("#webgl-canvas")[0]);
      this.update();
    },

    update: function() {
      requestAnimationFrame(App.update);
      g.update();
    }

  };

  return App;
});