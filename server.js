var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var users = [];

io.on('connection', function(socket){
    users.push({id: socket.client.id, nickname: ''});
  socket.on('disconnect', function(){
    for(var i = 0; i < users.length; i++) {
      if(users[i].id === socket.client.id) {
        if(users[i].nickname === '') {
          io.emit('chat message', 'anonynous left');
        }
        else {
          io.emit('chat message', users[i].nickname + ' left');
        }
        users.splice(i, 1);
        break;
      }
    }
  });
  socket.on('chat message', function(msg){
    for(var i = 0; i < users.length; i++) {
      if(users[i].id === socket.client.id) {
        var nickname = users[i].nickname;
        break;
      }
    }
    if(nickname === '') {
      socket.broadcast.emit('chat message', 'anonynous: ' + msg);
    }
    else {
      socket.broadcast.emit('chat message', nickname + ': ' + msg);
    }
  });
  socket.on('nickname', function(nickname){
    for(var i = 0; i < users.length; i++) {
      if(users[i].id === socket.client.id) {
        users[i].nickname = nickname;
        break;
      }
    }
  });
});

http.listen(process.env.PORT || 3000, function() {
  console.log('listening on *:3000');
});