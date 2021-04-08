# Gomoku

五子棋小游戏，分布式系统课设。

前端：angular+bootstrap+socket.io
后端：node+express+typescript+socket.io

## Setup & Run

### server

```bash
cd server
yarn install
yarn run prod
```

### client

```bash
cd client
yarn install
yarn run ng serve
```

## WebSocket Apis

### ToServer

- changeName(string):更名
- invite(Player):邀请参与游戏
- createGame(Player):建立游戏
- deny(Player):拒绝游戏
- shutdown():退出游戏
- win():赢得游戏
- setPiece(Point):落子
- ready(bool):准备
- message(string):战场通讯

### FromServer

- setPlayer(Player):设定默认用户名
- updatePlayers(Player[]):更新用户名单
- invite(Player):邀请参与游戏
- createGame(Player)
- exception(string):错误通知
- setPiece(Point):落子
- deny(Player):拒绝游戏
- shutdown():退出游戏
- defeat():失败
- ready(bool):准备
- start(Piece):开始
- message(string):战场通讯
