window.onload = function() {
  var cm = CodeMirror(document.body, {
    lineNumbers: true,
    readOnly: "nocursor"
  });

  var socket = io();
  console.log('connected to server');

  socket.on('uid', function(uid) {
    console.log('uid ' + uid);
  });

  $('form').submit(function(){
    if($('#m').val() === '') return false;
    console.log($('#m').val());
    socket.emit('code line', $('#m').val());
    $('#m').val('');
    $('#m').prop('disabled', true);
    return false;
  });

  socket.on('enable user', function() {
    console.log("enable user");
    $('#m').prop('disabled', false);
  });

  socket.on('disable user', function() {
    console.log("disable user");
    $('#m').prop('disabled', true);
  });

  socket.on('current text', function(text) {
    cm.setValue(text);
  })

};
