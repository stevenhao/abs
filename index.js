var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.use('/bower_components', express.static('bower_components'));

app.get('/', function(req, res) {
  res.sendFile('./index.html');
});

app.get('/tester', function(req, res) {
  res.sendFile('./tester.html');
});

io.on('connection', function(socket) {
  console.log('connected to client.');
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

module.exports = app;
