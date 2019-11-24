const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

class client {
  constructor (name, id) {
    this.name = name;
    this.id = id;
  }
}
var users = [];
var nombrerooms = [];
var username;
var status;
var idchat;
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/public/views/index.html`, (e) => {
    //res.send(JSON.stringify(e));
  });
});
app.get('/chatroom/:username', function (req, res) {
  username = req.params.username;
  res.sendFile(`${__dirname}/public/views/chatroom.html`, (e) => {
    //res.send(JSON.stringify(e));
  });
});

io.on('connection', function (socket) {
  socket.name = username;
  // socket.id=idchat;
  socket.broadcast.emit('message', socket.name + ' se ha conectado', '');
  socket.on('recibename', function (name) {
    if (!users.includes(name)) {
      nombre=name;
      users.push(name);
      socket.emit('recibearreglo', true);

    } else {
      socket.emit('recibearreglo', false);
    }

  })
  var channel = 'lobby';
  socket.join(channel);
  socket.on('message', function (msj) {
    //io.emit('message',msj,socket.name);
    if (status == 'private') {
      // socket.broadcast.to(socket.id).emit('message', msj,socket.name);
      socket.emit('message',msj,socket.name);
      socket.broadcast.to(idchat).emit('message', msj,socket.name);
    } else {
      console.log("No es privado");
      io.sockets.in(channel).emit('message', msj, socket.name);
    }
    

  });

  socket.on('privatemessage', function (id) {
    status='private';
    idchat=id;
  });

  socket.on('agrega name', function (nameuser) {
    const Client = new client (username, socket.id);
    users.push(Client);
    console.log("Este nombre ha sido ingresado: " + nameuser);
    io.emit('actualizanames', users);
  })
  socket.on('agrega room', function (nombreroom) {
    nombrerooms.push(nombreroom);
    io.emit('render rooms', nombrerooms);
  });

  socket.on('disconnect', function (e) {
    if (socket.name == undefined) {
      socket.broadcast.emit("nadie");
    }
  });

  socket.on('change channel', function (newChannel) {
    socket.leave(channel);
    socket.join(newChannel);
    channel = newChannel;
    status='public';
    socket.emit('change channel', newChannel);
  })
});
io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });

http.listen(3000, function () {
  console.log('listening on *:3000');
});