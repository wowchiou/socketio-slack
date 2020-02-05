const express = require('express');
const socketio = require('socket.io');

let currentRoom = '';
let currentNamespace = '';

let username = '';
let avatar = `https://pkq.herokuapp.com/static/Icon/${Math.floor(
  Math.random() * 151
) + 1}.png`;

// 引入 namespaces 資料
const namespaces = require('./data/namespaces');

// 建立 express server
const app = express();
app.use(express.static(__dirname + '/public'));

// 建立 socket.io server 並聆聽 9000 port
const PORT = 9000;
const io = socketio(
  app.listen(PORT, () => {
    console.log('This is socket.io server!');
  })
);

// socket.io server 做 main socket 連結事件
io.on('connection', socket => {
  const nsData = namespaces.map(ns => {
    return {
      id: ns.id,
      title: ns.title,
      img: ns.img,
      endpoint: ns.endpoint
    };
  });

  // 取得 user name
  username = socket.handshake.query.username;

  // main socket 發送 namespaces 資料給前端
  socket.emit('nsList', nsData);
});

namespaces.forEach(ns => {
  // 每個 namespace 做各自的 nsSocket 連結事件
  io.of(ns.endpoint).on('connection', nsSocket => {
    // nsSocket 被連結後發送房間資料給前端
    nsSocket.emit('nsRoomLoad', ns.rooms);

    // 監聽進入新房間
    nsSocket.on('joinRoom', roomToJoin => {
      // 離開原先房間,並更新離開的房間人數
      if (currentRoom) {
        nsSocket.leave(currentRoom);
        updateUserInRoom(currentNamespace, currentRoom);
      }

      // 進入新房間
      nsSocket.join(roomToJoin);

      // 更新新房間人數
      updateUserInRoom(ns.endpoint, roomToJoin);

      // 回傳新房間的留言紀錄
      const roomHistory = getRoomInfo(ns.rooms, roomToJoin).history;
      nsSocket.emit('historyCatchUp', roomHistory);

      // 紀錄目前 room 與 ns
      currentRoom = roomToJoin;
      currentNamespace = ns.endpoint;
    });

    // 監聽前端發送新訊息
    nsSocket.on('msgToServer', msg => {
      // 建立完整 message 資訊
      const fullInfo = {
        text: msg,
        time: Date.now(),
        avatar,
        username
      };

      // 將完整 message 加到該房間的歷史紀錄裡
      const roomState = getRoomInfo(ns.rooms, currentRoom);
      roomState.addMessage(fullInfo);

      // 只針對目前房間發送完整 message 資訊給前端
      io.of(ns.endpoint)
        .to(currentRoom)
        .emit('msgToClient', fullInfo);
    });
  });
});

function updateUserInRoom(endpoint, room) {
  io.of(endpoint)
    .in(room)
    .clients((err, client) => {
      io.of(endpoint)
        .in(room)
        .emit('updateRoomData', {
          numberOfMembers: client.length,
          roomName: room
        });
    });
}

function getRoomInfo(rooms, nowRoom) {
  const result = rooms.find(room => {
    return room.title === nowRoom;
  });
  return result;
}
