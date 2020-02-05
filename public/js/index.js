(function() {
  const username = prompt('你的名字');
  let nsSocket = '';

  // 連結 socket.io server
  const socket = io('http://localhost:9000', {
    query: {
      username
    }
  });

  // socket 監聽 server 發送的 nsList 事件
  socket.on('nsList', list => {
    // 收到 namespace 資料後,渲染 namespace 畫面
    buildNamespaceHtml(list);

    // 預設進入的 nsSocket
    joinNs('/mouse');
  });

  function joinNs(endpoint) {
    // 監測 nsSocket 是否有連接
    // 有連接中的 nsSocket 關閉連接
    // 並取消使用者聊天框的 submit 事件
    if (nsSocket) {
      nsSocket.close();
      // $('#user-input').unbind('submit', formSubmission);
    }

    // 連結新的 nsSocket
    nsSocket = io(`http://localhost:9000${endpoint}`);

    // nsSocket 監聽後端傳來的房間資料
    nsSocket.on('nsRoomLoad', nsRooms => {
      // 收到房間資料後,渲染房間畫面
      buildRoomsHtml(nsRooms);

      // 預設進入的 room
      joinRoom(nsRooms[0].title);
    });
  }

  function joinRoom(roomName) {
    // 進入房間
    nsSocket.emit('joinRoom', roomName);

    // 從後端得到該房間人數,並更新至畫面
    nsSocket.on('updateRoomData', roomData => {
      $('.num-users').text(roomData.numberOfMembers);
      $('.curr-room-text').text(roomData.roomName);
    });

    // 從後端得到該房間聊天歷史,並更新畫面
    nsSocket.on('historyCatchUp', history => {
      $('#messages').empty();
      if (history.length !== 0) {
        history.forEach(obj => {
          buildMessageHtml(obj);
        });
      }
    });

    // 從後端得到完整 message 資訊,並更新畫面
    nsSocket.on('msgToClient', msg => {
      buildMessageHtml(msg);
    });
  }

  $(document).on('click', '.namespace', function() {
    // namespace 點擊後連結對應的 nsSocket
    const nsEndpoint = getNsEndpoint($(this));
    joinNs(nsEndpoint);
  });

  $(document).on('click', '.room', function() {
    // room 點擊後連結對應的聊天室
    const room = $(this).text();
    joinRoom(room);
  });

  // 發送訊息給 nsSocket
  $(document).on('submit', '#user-input', function(e) {
    e.preventDefault();
    const message = $('#user-message').val();
    nsSocket.emit('msgToServer', message);
    $('#user-message').val('');
  });

  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  function buildNamespaceHtml(data) {
    let namespaceDiv = '';
    data.forEach(ns => {
      namespaceDiv += `<div class="namespace" ns=${ns.endpoint} ><span><img src=".${ns.img}" alt="${ns.title}" title="${ns.title}聊天區" /></span></div>`;
    });

    $('.namespaces')
      .empty()
      .append(namespaceDiv);

    $(document)
      .find('.namespace')
      .eq(0)
      .addClass('active');
  }

  function buildRoomsHtml(data) {
    let roomList = '';
    data.forEach(room => {
      let roomPrivate = 'globe';
      room.roomPrivate && (roomPrivate = 'lock');
      roomList += `<li class="room"><span class="glyphicon glyphicon-${roomPrivate}"></span>${room.title}</li>`;
    });
    $('.room-list')
      .empty()
      .append(roomList);
  }

  function buildMessageHtml(msg) {
    const currentTime = new Date(msg.time).toLocaleString();
    let msgStr = `
    <li>
      <div class="user-image">
        <img src="${msg.avatar}" />
      </div>
      <div class="user-message">
        <div class="user-name-time">${msg.username}<span>${currentTime}</span></div>
        <div class="message-text">${msg.text}</div>
      </div>
    </li>`;
    $('#messages').append(msgStr);
    $('#messages').scrollTo(0, $('#messages').scrollHeight);
  }

  function getNsEndpoint(el) {
    $('.namespace').removeClass('active');
    el.addClass('active');
    return el.attr('ns');
  }
})();
