const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

var users =  [];

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(`${__dirname}/public/views/index.html`, (e) => {
      //res.send(JSON.stringify(e));
  });
});
app.get('/chatroom', function(req, res){
  res.sendFile(`${__dirname}/public/views/chatroom.html`, (e) => {
      //res.send(JSON.stringify(e));
  });
});
app.get('/chatroom/:username', function(req, res){
  const username = req.param('username');
  res.sendFile(`${__dirname}/public/views/chatroom.html`, (e) => {
      //res.send(JSON.stringify(e));
  });
});

io.on('connection', function(socket){
  console.log("usuario id: %s",socket.id);

  socket.broadcast.emit('message',socket.id+' se ha conectado','System');
  socket.on('message',function(msj){
    io.emit('message',msj,socket.id);
  });

  socket.on('disconnect',function(e){
    console.log("desconectado: %s",socket.id);
  });
    // socket.broadcast.emit('hi');
    // socket.on('parcharse', function(username) {
    //     users.push(username);
    // });
    // socket.on('disconnect', function(){
    //     console.log('user disconnected');
    // });
    // socket.on('chat message', function(msg){
    //   io.emit('chat message', msg);
    // });
});
io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });

http.listen(3000, function(){
  console.log('listening on *:3000');
});