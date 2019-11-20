const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const users =  {};
var username;
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(`${__dirname}/public/views/index.html`, (e) => {
      //res.send(JSON.stringify(e));
  });
});
app.get('/chatroom/:username', function(req, res){
  username = req.params.username;
  res.sendFile(`${__dirname}/public/views/chatroom.html`, (e) => {
      //res.send(JSON.stringify(e));
  });
});

io.on('connection', function(socket){

  socket.name=username;
 
  socket.broadcast.emit('message',socket.name+' se ha conectado','System');
  socket.on('message',function(msj){
    io.emit('message',msj,socket.name);
  });

  socket.on('disconnect',function(e){
    console.log("desconectado: %s",socket.name);
  });
});
io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });

http.listen(3000, function(){
  console.log('listening on *:3000');
});