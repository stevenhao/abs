var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.use('/bower_components', express.static('bower_components'));

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.get('/tester', function(req, res) {
  res.sendfile('./tester.html');
});

(function() {

  var text = '';

  io.on('connection', function(socket) {
    console.log('connected to client.');
    socket.emit('current text', text);

    socket.on('backspace', function() {
      text = text.substring(0, text.length - 1);
      io.emit('current text', text);
      console.log(text);
    });
    socket.on('keystroke', function(key) {
      text = text + key;
      io.emit('current text', text);
      console.log(text);
    });
  });

})();

http.listen(3000, function() {
  console.log('listening on *:3000');
});

module.exports = app;
