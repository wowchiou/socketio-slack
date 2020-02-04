function joinNs(endpoint) {
  if (nsSocket) {
    nsSocket.close();
    $('#user-input').unbind('submit', formSubmission);
  }

  var nsSocket = io(`http://localhost:9000${endpoint}`);

  nsSocket.on('nsRoomLoad', nsRooms => {
    let roomList = '';

    nsRooms.forEach(room => {
      let roomPrivate = 'globe';
      room.roomPrivate && (roomPrivate = 'lock');
      roomList += `<li class="room"><span class="glyphicon glyphicon-${roomPrivate}"></span>${room.title}</li>`;
    });

    $('.room-list')
      .empty()
      .append(roomList);
  });
}
