var exec = require("exec");
var async = require("async");

var plugin = {
  dimensionsX: 0,
  dimensionsY: 0,
  oldX: 0,
  oldY: 0,
  init: function (socket) {
    process.env['DISPLAY'] = ':0';
  },
  methods: {
    key: function(data) {
      var key = data.key || ""
      if(key){
        return function(callback){
          exec("xdotool key " + key, {}, function(err, out, code){
            callback({key:key});
          });
        }
      }
    },
    moveMouse: function(data) {
      var x = data.x || 0;
      var y = data.y || 0;
      if(x && y){
        return function(callback){
          exec("xdotool mousemove " + x + " " + y, {}, function(err, out, code){
            callback({x:x, y:y});
          });
        }
      }
    },
    clickMouse: function(data) {
      var id = data.id || 1;
      return function(callback){
        exec("xdotool click " + id , {}, function(err, out, code){
        });
      }
    },
    getScreenDimensions: function(method) {
      return function(callback){
        exec("printenv DISPLAY", {}, function(err, out, code){
          if(out){
            exec("xdpyinfo -display $DISPLAY | grep dimensions", {}, function(err, dim, code){
              if(dim){
                var regex = /\s(\d*)x(\d*).*pixels/gi;
                var dims = regex.exec(dim);
                if(dims[1] && dims[2]){
                  var value = {
                    dimX: dims[1],
                    dimY: dims[2],
                    err: null
                  }
                  callback(value);
                  return;
                }
              }
              var value = {
                dimX: null,
                dimY: null,
                err: "Error getting dimensions"
              }
              callback(value);
              return;
            });
          }else{
            var value = {
              dimX: null,
              dimY: null,
              err: "Error getting DISPLAY"
            }
            callback(value);
            return;
          }
        });
      };
    }
  }
};

module.exports = plugin;