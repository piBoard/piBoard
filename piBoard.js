var http      = require('http'),
    fs        = require('fs'),
    url       = require('url'),
    path      = require('path'),
    dgram     = require("dgram"),
    io        = require('socket.io');

var plugins = {};
var pluginsMethods = {};
var discoveryServer = dgram.createSocket("udp4");
var conf = "";

var piBoard = {
  httpHandler: function(req, res) {
    var uri = url.parse(req.url).pathname;
    if(uri == "/"){
      uri = "/index.html";
    }
    var filename = path.join(__dirname, uri);
    fs.readFile(filename,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading file: ' + uri);
      }

      res.writeHead(200);
      res.end(data);
    });
  },
  pluginsHandler: function() {
    var dir = path.join(path.resolve(__dirname),"plugins");
    files = fs.readdirSync(dir).filter(function (file) {
      return (file[0] !== '.') && fs.statSync(path.join(dir, file)).isDirectory();
    });
    for(var i in files) {
      var file = files[i];
      var packagePath = path.join(dir, file);
      var jsonPath = path.join(dir, file) + '/package.json';
      if (fs.existsSync(jsonPath)) {
        if(piBoard.readJSON(jsonPath).disabled) continue;
        plugins[file] = piBoard.readJSON(jsonPath);
        plugins[file].path = packagePath;
        plugins[file].id = file;
        if(plugins[file].main && fs.existsSync(packagePath + '/' + plugins[file].main)) {
          plugins[file].content = fs.readFileSync(packagePath + '/' + plugins[file].main, 'utf8');
        }
      }
    }
    return plugins;
  },
  initPlugins: function(socket) {
    var dir = path.join(path.resolve(__dirname),"plugins");
    for(var plugin in plugins) {
      var pluginId = plugins[plugin].id;
      var packagePath = path.join(dir, plugin);
      var pluginPath  = packagePath + '/' + plugin + '.js';
      if (fs.existsSync(pluginPath)) {
        var pluginInclude  = require(pluginPath);
        if(typeof pluginInclude.init == 'function'){
          pluginInclude.init(socket);
        }
        if(pluginInclude.methods){
          pluginsMethods[plugin] = pluginInclude.methods;
          var methodsHandler = '<script type="text/javascript">';
          methodsHandler += 'plugins["' + plugin + '"]["methods"] = {};';
          methodsHandler += 'plugins["' + plugin + '"]["callbacks"] = {};'
          for(var method in pluginInclude.methods) {
            methodsHandler += 'plugins["' + plugin + '"]["methods"]["' + method + '"] = function(callback, args) {';
            methodsHandler +=  'plugins["' + plugin + '"]["callbacks"]["' + method + '"] = callback;';            
            methodsHandler +=  'socket.removeListener("' + plugin + '-' + method + '-result", plugins["' + plugin + '"]["callbacks"]["' + method + '"]);'; 
            methodsHandler +=  'socket.on("' + plugin + '-' + method + '-result", plugins["' + plugin + '"]["callbacks"]["' + method + '"]);'; 
            methodsHandler +=  'socket.emit("pluginsCallMethod", {plugin: "' + plugin + '",method: "' + method + '",args: args});';
            methodsHandler += '};';
          }
          methodsHandler += '</script>';
          plugins[plugin].methodsHandler = methodsHandler;
        }
      }
    }
    socket.on("pluginsCallMethod", function(data) {
      var plugin = data.plugin || "";
      var method = data.method || "";
      var args = data.args || {};
      if(plugin && method && typeof pluginsMethods[plugin][method] == "function"){
        var value = pluginsMethods[plugin][method](args);
        if(value){
          if(typeof value == "function"){
            value(function(val){
              socket.emit(plugin + "-" + method + "-result", val);
            });
          }else{
            socket.emit(plugin + "-" + method + "-result", value);
          }
          
        }
      }
    });
    return plugins;
  },
  init: function() {
    var confFile = path.join(path.resolve(__dirname),"package.json");
    conf = piBoard.readJSON(confFile);
    http = http.createServer(piBoard.httpHandler);
    io = io.listen(http);
    http.listen(3045);
    io.use(function(socket, next) {
      var handshake = socket.request;
      if(conf.piBoard.password){
        if(handshake._query.pass == conf.piBoard.password){
          next(null, true);
        } else {
          next("error");
        }
      }else{
        next(null, true);
      }
    });
    io.on('connection', function(socket){
      socket.on('getPlugins', function(data){
        piBoard.pluginsHandler();
        piBoard.initPlugins(socket);
        socket.emit('plugins', {plugins: plugins});
      });

      socket.on('disconnect', function(){
        socket.disconnect();
      })
      console.log('a user connected');
    });

    discoveryServer.on("message", function (msg, rinfo) {
      var info = {}
      info.name = conf.piBoard.name;
      if(conf.piBoard.password){
        info.isSecured = true;
      }else{
        info.isSecured = false;
      }
      var message = new Buffer(JSON.stringify(info));
      discoveryServer.send(message, 0, message.length, 41235, rinfo.address);
      console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
    });

    discoveryServer.bind(41234);
  },
  readJSON: function(file){
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
}

piBoard.init();
