const express = require('express');
const socketio = require('socket.io');
const namespaces = require('./data/namespaces');

const app = express();
app.use(express.static(__dirname + '/public'));

const io = socketio(
  app.listen(9000, () => {
    console.log('This is socket.io server!');
  })
);

io.on('connection', socket => {
  const nsData = namespaces.map(ns => {
    return {
      id: ns.id,
      title: ns.title,
      img: ns.img,
      endpoint: ns.endpoint
    };
  });
  socket.emit('nsList', nsData);
});

namespaces.forEach(ns => {
  io.of(ns.endpoint).on('connection', nsSocket => {
    const username = nsSocket.handshake.query.username;
    nsSocket.emit('nsRoomLoad', ns.rooms);
  });
});
