let app = require('express')();
let http = require('http').Server(app);

let io = require('socket.io')(http);

let socketClients = [];
let onlineCliens = [];
let desks = [];

// 是否在游戏中
function existsDesk(socketId) {
  // for (let item of desks) {
  //     console.log('能执行');
  //     if (item.White === socketId || item.Black === socketId) {
  //         return true;
  //     }
  // }

  for (let key in desks) {
    if (desks[key].White === socketId || desks[key].Black === socketId) {
      return true;
    }
  }
  console.log('byhuhuhu能执行');
  return false;
}

io.on('connection', function (socket) {
  let _socketId = socket.id;
  socket.emit('connection');
  console.log('a user connect');

  //删除桌
  function delDesk(index) {
    delete desks[index];
    //desks[index].Result = true;
  }

  //连接断开退出游戏
  socket.on('disconnect', () => {
    console.log('检测到断开');
    for (let key in socketClients) {
      if (key === _socketId) {
        delete socketClients[key];
        break;
      }
    }
    console.log('desks', desks);

    for (let key in desks) {
      console.log('White', key);
      if (desks[key].White === _socketId || desks[key].Black === _socketId) {
        console.log('fasdefefcec检测到断开');
        socketClients[desks[key].White === _socketId ? desks[key].Black : desks[key].White].socket.emit('shutdown');
        delDesk(key);
      }
    }

    desks.forEach(function (item, index) {
      console.log('White', index);

      if (item.White === _socketId || item.Black === _socketId) {
        console.log('fasdefefcec检测到断开');
        socketClients[item.White === _socketId ? item.Black : item.White].socket.emit('shutdown');
        delDesk(index);
      }
    });
    // for (let item of desks) {
    //     console.log('White',item.White);
    //
    //     if (item.White === _socketId || item.Black === _socketId) {
    //         console.log('fasdefefcec检测到断开');
    //         socketClients[item.White === _socketId ? item.Black : item.White].socket.emit('shutdown');
    //         delDesk(item.White);
    //         break;
    //     }
    // }

    // for (let i = desks.length - 1; i >= 0; i--) {
    //     let desk = desks[i];
    //     if (desk.White === _socketId || desk.Black === _socketId) {
    //         console.log('fasdefefcec检测到断开');
    //         socketClients[desk.White === _socketId ? desk.Black : desk.White].socket.emit('shutdown');
    //         delDesk(i);
    //         break;
    //     }
    // }
  });

  socket.on('exitDesk', function (deskId) {
    let desk = desks[deskId];
    if (desk.White === _socketId || desk.Black === _socketId) {
      console.log('aaaaaaaaaaaa检测到断开');
      socketClients[desk.White === _socketId ? desk.Black : desk.White].socket.emit('shutdown');
      delDesk(deskId);
    }
  });

  //通过姓名获取socket
  function getClientByName(name) {
    for (let key in socketClients) {
      let item = socketClients[key];
      if (item.name === name) {
        return item;
      }
    }
  }

  socket.on('joinLobby', function (name) {
    socketClients[_socketId] = {
      socketId: _socketId,
      socket: socket,
      name: name,
      isGaming: false
    };
    socket.emit('joinLobby', _socketId);
    console.log('a user join : ' + name);
  });

  function updateClients() {
    if (socketClients != null) {
      for (let key in socketClients) {
        let client = socketClients[key];
        let result = [];
        for (let key2 in socketClients) {
          if (key2 !== key && !existsDesk(key2)) {
            result.push({
              socketId: key2,
              name: socketClients[key2].name
            });
          }
        }
        client.socket.emit('updateClients', result);

      }
    }
    ///console.log('广播在线用户！');
  }

  setInterval(updateClients, 10000);

  socket.on('refreshSocket', function (socketId) {
    console.log(socketClients);
    if (socketId) {
      console.log('refresh:' + socketId);
      let client = socketClients[socketId];
      console.log(socketClients);
      if (client) {
        console.log('更新了一个用户的socket');
        if (socket.id !== client.socket.id) {
          client.socket = socket;
        }
      } else {
        console.log('服务器没有客户端数据!!!!ß！');
        socket.emit('reset');
      }
    } else {
      console.log('服务器没有客户端数据！');
      socket.emit('reset');
    }
  });

  socket.on('queryAllUsers', function () {
    socket.emit('queryAllUsers', socketClients);
    console.log(socketClients);
  });

  socket.on('applyConnect', function (playDesk) {
    let thisClient = socketClients[_socketId];
    //获取到对手的信息
    let opponentClient = socketClients[playDesk.BSocketId];

    opponentClient.socket.emit('applyConnect', {
      AName: socketClients[_socketId].name,
      ASocketId: thisClient.socketId,
      AIsReady: true,
      BSocketId: opponentClient.socketId,
      BIsReady: false
    });
  });

  //对方回复请求
  socket.on('agreePlay', function (playDesk) {
    let APlayer = socketClients[playDesk.ASocketId];
    let BPlayer = socketClients[playDesk.BSocketId];
    //建立游戏室
    desks[APlayer.socketId] = {
      White: APlayer.socketId,
      Black: BPlayer.socketId,
      Result: false
    };
    if (playDesk.AIsReady === true && playDesk.BIsReady === true) {
      console.log(BPlayer.name);
      APlayer.socket.emit('startPlay', {
        name: BPlayer.name,
        socketId: BPlayer.socketId,
        deskId: APlayer.socketId,
        role: 1,
      });
      BPlayer.socket.emit('startPlay', {
        name: APlayer.name,
        socketId: APlayer.socketId,
        deskId: APlayer.socketId,
        role: -1,
      });
    }
  });

  //下棋交互
  //下棋
  socket.on('setPiece', function (data) {
    let deskId = data.gameId;

    let desk = desks[deskId];
    let socket1;
    if (_socketId === desk.White) {
      socket1 = socketClients[desk.Black].socket;
    }
    if (_socketId === desk.Black) {
      socket1 = socketClients[desk.White].socket;
    }

    socket1.emit('setPiece', data.point);

  });

});

http.listen(3000, function () {
  console.log('server start');
});
