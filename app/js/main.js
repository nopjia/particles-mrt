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
  }
});

require(["app"], function(App) {
  App.init();
});