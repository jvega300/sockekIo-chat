var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('servidor corriendo en puerto 3000');

app.get('/', function (req, res){
  res.sendFile(__dirname+'/index.html');
});


io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Conexiones: %s sockets conectados', connections.length);

  //Desconectar
  socket.on('disconnect', function(data){
    //if(!socke.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Desconexión: %s sockets conectados', connections.length);
  })

  //Enviar mensaje
  socket.on('send message', function(data){
    //console.log(data);
    io.sockets.emit('new message', {msg:data, user: socket.username});
    console.log('Desconexión: %s sockets conectados', connections.length);
  })

  //Nuevo Usuario
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  })

  function updateUsernames(){
    io.sockets.emit('get users', users);
  }
 
});