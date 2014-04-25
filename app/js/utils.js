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
    }

  };

  return Utils;
});