import {Injectable} from '@angular/core';
import {Piece} from '../models/piece.enum';
import {BoardService} from './board.service';
import {Point} from '../models/point';
import {WebSocketService} from './web-socket.service';
import {MessageService} from './message.service';
import {Player} from '../models/player';
import {Direction} from '../models/direction.enum';
import {SystemService} from './system.service';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class GameService
{
  get started(): boolean
  {
    return this.pvtStarted;
  }

  get oppositePiece(): Piece
  {
    if (typeof (this.pvtOppoPiece) === 'undefined')
    {
      throw new Error('游戏尚未初始化。');
    }
    return this.pvtOppoPiece;
  }

  get myPiece(): Piece
  {
    if (typeof (this.pvtMyPiece) === 'undefined')
    {
      throw new Error('游戏尚未初始化。');
    }
    return this.pvtMyPiece;
  }

  private pvtMyPiece: Piece | undefined;
  private pvtOppoPiece: Piece | undefined;
  private pvtStarted = false;
  public oppositePlayer: Player | undefined;
  public isReady = false;
  public remoteReady = false;

  public myScore = 0;
  public opsScore = 0;

  constructor(public board: BoardService,
              private router: Router,
              private system: SystemService,
              private ws: WebSocketService,
              private msg: MessageService)
  {

    ws.observe<Point>('setPiece')
      .subscribe(p => this.remoteSetPiece(p));
    ws.observe('shutdown')
      .subscribe(() => this.remoteShutdown());
    ws.observe<boolean>('ready')
      .subscribe(r => this.remoteReady = r);
    ws.observe<Piece>('start')
      .subscribe(p => this.start(p));
    ws.observe<string>('message')
      .subscribe(m => this.msg.addInfo(
        `${this.oppositePlayer?.name}: ${m}`));
    ws.observe('defeat')
      .subscribe(() => this.defeat());
    this.system.createGame
      .subscribe((p: Player) => this.remoteCreateGame(p));
  }

  private remoteCreateGame(player: Player): void
  {
    this.oppositePlayer = player;
    this.router.navigate(['/Game']).then();
  }

  private reset(): void
  {
    if (this.system.me)
    {
      this.system.me.inGame = false;
    }

    this.myScore = 0;
    this.opsScore = 0;
    this.resetGame();
    this.router.navigate(['/Home']).then();

  }

  private remoteShutdown(): void
  {
    this.msg.addError('对方终止了游戏。');
    this.reset();
  }

  private remoteSetPiece(point: Point): void
  {
    this.board.setPiece(new Point(point.x, point.y), this.oppositePiece);
  }

  private start(myPiece: Piece): void
  {
    this.pvtMyPiece = myPiece;
    if (myPiece === Piece.black)
    {
      this.pvtOppoPiece = Piece.white;
      this.msg.addInfo('比赛开始。您是黑棋，请先行。');
    }
    else
    {
      this.pvtOppoPiece = Piece.black;
      this.msg.addInfo('比赛开始。您是白棋，对方先行。');
    }
    // 黑棋先行
    this.board.pieceLock = myPiece === Piece.white;

    this.pvtStarted = true;
  }

  public ready(): void
  {
    const r = !this.isReady;
    if (r)
    {
      this.msg.addOk('准备成功');
    }
    else
    {
      this.msg.addWarning('取消成功');
    }
    this.ws.raise('ready', r);
    this.isReady = r;

  }

  public shutdown(): void
  {

    this.ws.raise('shutdown');
    this.reset();

  }

  public sendMessage(m: string): void
  {
    this.ws.raise('message', m);
    this.msg.addOk('发送成功');
  }

  public setPiece(point: Point): void
  {
    this.ws.raise('setPiece', point);
    this.board.setPiece(point, this.myPiece);
    if (this.validate(point))
    {
      this.ws.raise('win');
      this.win();
    }

  }

  validate(point: Point): boolean
  {

    // 依次验证四个方向
    return [1, 2, 3, 4].some((dir) =>
    {
      return this.validateDirection(point, dir);
    }, this);
  }

  /**
   * 验证某个方向上，新下的棋子和现存棋子是否连成5个
   * @param point 新下的棋子
   * @param direction 待检查的方向
   */
  validateDirection(point: Point, direction: Direction): boolean
  {

    let count = 1;
    const currentColor = this.board.PieceOf(point);
    if (typeof (currentColor) === 'undefined')
    {
      return false;
    }
    for (let i = 1, it = point.next(direction); i < 5 && it.valid()
    && this.board.PieceOf(it) === currentColor;
         i++ , count++, it = it.next(direction))
    {
    }
    // 反向查找
    for (let i = 1, it = point.next(-direction); i < 5 && it.valid()
    && this.board.PieceOf(it) === currentColor;
         i++ , count++, it = it.next(-direction))
    {
    }
    return count === 5;
  }

  private resetGame(): void
  {
    this.pvtStarted = false;
    this.isReady = false;
    this.remoteReady = false;
    this.board.reset();
  }

  private win(): void
  {
    this.msg.addOk('你赢得了比赛！');
    this.myScore++;
    this.resetGame();
  }

  private defeat(): void
  {
    this.msg.addWarning('对方赢得了比赛！');
    this.opsScore++;
    this.resetGame();
  }
}
