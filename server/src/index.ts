import * as express from 'express';
import * as http from 'http';
import { Socket } from 'socket.io';
import * as cors from 'cors';
import { Player } from './models/player';
import { GomokuServer } from './gomoku-server';


const app = express();
app.use(cors());
app.use(express.static('public'));
const server = http.createServer(app);
const wss = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});
const gmk = new GomokuServer();




wss.on('connection',
    (socket: Socket) => {
        const id = socket.id;
        gmk.clients.set(id, socket);
        const p: Player = {
            name: `玩家${gmk.userCount++}`,
            inGame: false,
            id
        };
        console.log(`${p.name}(${id})加入游戏。`)
        gmk.players.set(id, p);
        socket.emit('setPlayer', p);
        gmk.broadcastPlayers();
        socket.on('disconnect', gmk.disconnect(id));
        socket.on('changeName', gmk.changeName(id));
        socket.on('invite', gmk.invite(p));
        socket.on('createGame', gmk.createGame(p));
        socket.on('deny', gmk.deny(p));
        socket.on('shutdown', gmk.shutdown(id));
        socket.on('win', gmk.win(id));
        socket.on('setPiece', gmk.setPiece(id));
        socket.on('ready', gmk.ready(id));
        socket.on('message', gmk.message(id));
    }
);

server.listen(3000, () => {
    console.log('服务器启动成功。');
});

