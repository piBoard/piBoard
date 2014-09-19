var monitor = require("os-monitor");
var exec = require("exec");

var plugin = {
  init: function (socket) {
    monitor.start();
    monitor.on('freemem', function(event) {
      socket.emit('system-freemem-result', {event:event});
    });
    monitor.on('loadavg1', function(event) {
      socket.emit('system-loadavg1-result', {event:event});
    });
    monitor.on('loadavg5', function(event) {
      socket.emit('system-loadavg5-result', {event:event});
    });
    monitor.on('loadavg15', function(event) {
      socket.emit('system-loadavg15-result', {event:event});
    });
  },
  methods: {
    monitor: function() {
      return function(callback){
        monitor.on('monitor', function(event) {
          callback(event);
        });
      }
    },
    exec: function(data) {
      var command = data.command || "";
      var args = data.args || {};
      if(command){
        return function(callback){
          exec(command, args, function(err, out, code){
            var value = {
              err: err,
              out: out,
              code: code
            }
            callback(value);
          });
        }
      }
    },
    callMethod: function(method) {
      if(typeof monitor.os[method] == "function"){
        return monitor.os[method]()
      }
    }
  }
};

module.exports = plugin;