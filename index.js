var express = require('express');

var app = express();
app.set('port', process.env.PORT || 3000);

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

    var uid = tot_users;
    alive.push(true);
    sockets.push(socket);
    live_users ++;
    tot_users ++;

    console.log('connected to client ' + uid);

    socket.emit('uid', uid);
    socket.emit('current text', text);

    if(live_users == 1) {
      cur_user = uid;
      socket.emit('enable user');
    } else {
      socket.emit('disable user');
    }

    socket.on('disconnect', function() {
      console.log("user " + uid + " disconnected");
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
      io.emit('current text', text, cur_user);
      console.log(text);
      next_user();
    });
  });

})();


http.listen(app.get('port'), function() {
  console.log('listening on ' + app.get('port'));
});

module.exports = app;
