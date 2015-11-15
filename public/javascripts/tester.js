window.onload = function() {
  var socket = io();
  console.log('connected to server');

  $(document).keydown(
    function(event) {
      if (event.which === 8) {
        event.preventDefault();
        socket.emit('backspace');
        console.log('Send special backspace');
      }
    }
  );
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
