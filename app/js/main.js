require.config({
  shim: {
    Stats: {
      exports: "Stats"
    }
  },
  paths: {
    jquery: "vendor/jquery",
    Stats: "vendor/Stats",
    shortcut: "vendor/shortcut",
    glMatrix: "vendor/gl-matrix"  // TODO: fix this
  }
});

require(["app", "vendor/gl-inspector/core/embed"], function(App) {
  App.init();
});