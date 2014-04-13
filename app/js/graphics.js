define([
  "Stats",
  "utils"
  ],
  function(
    Stats,
    Utils
  ) {

  var gl = null;

  var Graphics = {
    CAM_FOV: 45,
    CAM_NEAR: 1,
    CAM_FAR: 1000,

    container: null,
    stats: null,

    init: function(container) {
      this.container = container;

      // init stats
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.zIndex = 100;
      this.container.appendChild( this.stats.domElement );
    },

    update: function(elapsedTime) {
      this.stats.update();
    },

    onWindowResize: function() {
    }
  };

  return Graphics;
});