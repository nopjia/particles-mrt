define([
  "jquery",
  "shortcut",
  "graphics",
  ],
  function(
    ignore,
    shortcut,
    g
  ) {

  var App = {

    init: function() {
      g.init($("#webgl-container")[0]);
      this.update();
    },

    update: function() {
      requestAnimationFrame(App.update);

      g.update();
    }

  };

  return App;
});