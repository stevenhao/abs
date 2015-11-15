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
  var tot_users = 0;
  var alive = [];
  var sockets = [];
  var live_users = 0;
  var cur_user;

  // find the next user and ask them to enable
  var next_user = function () {
    if(live_users == 0) return;
    cur_user ++, cur_user %= tot_users;
    while(!alive[cur_user]) {
      cur_user ++, cur_user %= tot_users;
    }
    // cur_user is the next alive user
    console.log('enable ' + cur_user);
    sockets[cur_user].emit('enable user');
  };

  io.on('connection', function(socket) {
    console.log('connected to client.');

    var uid = tot_users;
    alive.push(true);
    sockets.push(socket);
    live_users ++;

    socket.emit('uid', uid);
    socket.emit('current text', text);

    if(live_users == 1) {
      cur_user = 1;
      socket.emit('enable user');
    } else {
      socket.emit('disable user');
    }

    tot_users ++;

    socket.on('disconnect', function() {
      alive[uid] = false;
      live_users --;
      if(cur_user === uid) {
        next_user();
      }
    });

    socket.on('code line', function(key) {
      if(uid !== cur_user) return;
      socket.emit('disable user');
      if(text !== '') text += '\n';
      text += key;
      io.emit('current text', text);
      console.log(text);
      next_user();
    });
  });

})();

http.listen(3000, function() {
  console.log('listening on *:3000');
});

module.exports = app;
