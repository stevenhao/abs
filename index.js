var express = require('express');
var http = require('http')
var path = require('path');

var app = express();
app.set('port', process.env.PORT || 3000)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use('/', routes);
app.use('/', require('./routes/index'));

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
