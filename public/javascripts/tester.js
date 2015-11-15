window.onload = function() {
  var socket = io();
  console.log('connected to server');

  $(document).keypress(
    function(event) {
      var key = String.fromCharCode(event.charCode);
      socket.emit('keystroke', key);
      console.log('Send ' + key);
    }
  );

  socket.on('current text', function(text) {
    $('#text').text(text);
  })
};
