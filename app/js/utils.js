define([], function() {

  var Utils = {

    loadTextFile: function(url) {
      var result;
      
      $.ajax({
        url:      url,
        type:     "GET",
        async:    false,
        dataType: "text",
        success:  function(data) {
          result = data;
        }
      });
      
      return result;
    },

    radians: function(degrees) {
      return degrees * Math.PI / 180.0;
    },

    degrees: function(rads) {
      return rads * 180.0 / Math.PI;
    },

    hexToRgb: function(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : null;
    },

    rgbToHex: function() {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    screenshotToNewWindow: function(canvas) {
      var url = canvas.toDataURL();
      window.open(url, "Screenshot", "width="+canvas.width+" height="+canvas.height+" scrollbars=no, resizable=yes");
    }

  };

  return Utils;
});