window.onload = function() {
  var cm = CodeMirror(document.body, {
    lineNumbers: true,
    readOnly: "nocursor",
    gutters: ["CodeMirror-linenumbers", "author"]
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
    $('#m').prop('disabled', false).focus();
  });

  socket.on('disable user', function() {
    console.log("disable user");
    $('#m').prop('disabled', true);
  });

  function makeAuthorDiv(author) {
    var d = document.createElement("div");
    d.style.color = "#822";
    d.innerHTML = author;
    return d;
  }

  socket.on('current text', function(text, uid) {
    cm.setValue(text);
    if (typeof uid !== 'undefined') {
      var n = cm.lineCount() - 1;
      var info = cm.lineInfo(n);
      if (info) {
        cm.setGutterMarker(n, "author", info.gutterMarkers ? null : makeAuthorDiv(uid));
      } else {
        console.log("null info (len = " + n + ")");
      }
    }
  });
};
