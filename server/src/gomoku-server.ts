import { Game } from './models/game';
import { Socket } from 'socket.io';
import { Player } from './models/player';
import { Point } from './models/point';
import { Piece } from './models/piece.enum';

export class GomokuServer {
  private games = new Map<string, Game>();
  public clients = new Map<string, Socket>();
  public players = new Map<string, Player>();
  public userCount = 1;

  removeGame(g: Game, currentUser?: string): void {
    if (currentUser) {
      const anu = g.player1Id === currentUser
        ? g.player2Id
        : g.player1Id;
      if (this.clients.get(anu))
        this.clients.get(anu).emit('shutdown');
    }
    this.games.delete(g.player1Id);
    this.games.delete(g.player1Id);
    const player1 = this.players.get(g.player1Id);
    if (player1)
      player1.inGame = false;
    const player2 = this.players.get(g.player2Id);
    if (player2)
      player2.inGame = false;
    if (player1 && player2)
      console.log(`${player1.name}(${player1.id})和${player2.name}(${player2.id})的游戏结束。`);
      this.broadcastPlayers();
  }

  broadcast(event: string, arg?: any): void {
    this.clients.forEach((v, k, m) => {
      v.emit(event, arg);
    });
  }

  broadcastPlayers(): void {
    this.broadcast('updatePlayers', Array.from(this.players.values()));
  }

  getOpposite(playerId: string): string | null {
    const g = this.games.get(playerId);
    if (!g) {
      return null;
    }
    return this.getOppositeOfGame(playerId, g);
  }

  getOppositeClient(playerId: string): Socket | undefined {
    const ops = this.getOpposite(playerId);
    if (!ops) {
      console.error('未找到对手。');
      return undefined;
    }
    return this.clients.get(ops);
  }

  getOppositeOfGame(playerId: string, g: Game): string {
    return g.player1Id === playerId
      ? g.player2Id
      : g.player1Id;
  }

  userNotFound(id: string): void {
    console.error(`无法找到玩家${id}`);
  }

  shutdown(id: string): () => void {
    return () => {
      const g = this.games.get(id);
      if (!g) {
        this.userNotFound(id);
        return;
      }
      this.removeGame(g, id);
    };
  }

  disconnect(id: string): () => void {
    return () => {
      const player = this.players.get(id);
      if (player) {
        console.log(`${player.name}(${player.id})断开连接。`)
      }
      this.shutdown(id)();
      this.players.delete(id);
      this.clients.delete(id);
      this.broadcastPlayers();
    };
  }

  changeName(id: string): (newName: string) => void {
    return (newName) => {
      const p = this.players.get(id);
      if (!p) {
        this.userNotFound(id);
        return;
      }
      console.log(`${p.name}(${id})更名为 ${newName}。`)
      p.name = newName;
      this.broadcastPlayers();
    };
  }

  invite(p: Player): (player: Player) => void {
    return (player) => {
      const ops = this.clients.get(player.id);
      if (!ops) {
        this.userNotFound(player.id);
        this.clients.get(p.id).emit('exception', '玩家已离开。');
        return;
      }
      ops.emit('invite', p);
      console.log(`${p.name}(${p.id})邀请${player.name}(${player.id})进行游戏。`)
    };
  }

  createGame(p: Player): (player: Player) => void {
    return (player) => {
      console.log(`${p.name}(${p.id})接受了邀请。`);
      const ops = this.clients.get(player.id);
      if (!ops) {
        this.userNotFound(player.id);
        this.clients.get(p.id).emit('exception', '玩家已离开。');
        return;
      }
      player = this.players.get(player.id);
      if (player.inGame) {
        this.clients.get(p.id).emit('exception', '玩家已在游戏中。');
        return;
      }
      console.log(`${p.name}(${p.id})接受了邀请。`);
      const game = {
        player1Id: p.id,
        player2Id: player.id,
        player1Ready: false,
        player2Ready: false
      };
      p.inGame = true;
      player.inGame = true;
      this.games.set(p.id, game);
      this.games.set(player.id, game);
      ops.emit('createGame', p);
      this.clients.get(player.id).emit('createGame', p);
      this.clients.get(p.id).emit('createGame', player);
      console.log(`${p.name}(${p.id})和${player.name}(${player.id})创建游戏。`)
      this.broadcastPlayers();
    };
  }

  deny(p: Player): (player: Player) => void {
    return (player) => {
      console.log(`${p.name}(${p.id})拒绝了邀请。`);
      this.clients.get(player.id).emit('deny', p);
    };
  }

  win(id: string): () => void {
    return () => {
      this.getOppositeClient(id).emit('defeat');
      const game = this.games.get(id);
      if (game) {
        game.player1Ready = false;
        game.player2Ready = false;
        // 交换场地
        const buf = game.player1Id;
        game.player1Id = game.player2Id;
        game.player2Id = buf;
      }
    };
  }

  setPiece(id: string): (point: Point) => void {
    return (point) => {
      this.getOppositeClient(id).emit('setPiece', point);
    };
  }

  ready(id: string): (r: boolean) => void {
    return (r) => {
      const g = this.games.get(id);
      if (!g) {
        console.error(`玩家${id}不在游戏中`);
        return;
      }
      if (id === g.player1Id) {
        g.player1Ready = r;
      }
      else {
        g.player2Ready = r;
      }
      this.clients.get(this.getOppositeOfGame(id, g)).emit(
        'ready', r
      );
      if (g.player1Ready && g.player2Ready) {
        this.clients.get(g.player1Id).emit(
          'start', Piece.black
        );
        this.clients.get(g.player2Id).emit(
          'start', Piece.white
        );
      }
    };
  }

  message(id: string): (msg: string) => void {
    return (msg) => {
      this.getOppositeClient(id).emit('message', msg);
    };
  }
}
