require.config({
  paths: {
    jquery: "vendor/jquery",
    Stats: "vendor/Stats",
    mousetrap: "vendor/mousetrap",
    glMatrix: "vendor/gl-matrix",
    datGUI: "vendor/dat.gui"  // TODO: fix this
  }
});

require(["app"], function(App) {
  App.init();
});