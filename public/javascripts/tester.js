window.onload = function() {
  var cm = CodeMirror(document.body, {
    lineNumbers: true,
    readOnly: "nocursor"
  });

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
    cm.setValue(text);
  })
};
