import {Injectable} from '@angular/core';
import {Piece} from '../models/piece.enum';
import {Point} from '../models/point';
import {GameService} from './game.service';
import {MessageService} from './message.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService
{

  public context: CanvasRenderingContext2D | undefined | null;
  public canvas: HTMLCanvasElement | undefined;
  public box: (Piece | undefined)[][] = [];
  public pieceLock = false;

  private game: GameService | undefined;

  constructor(private msg: MessageService)
  {
  }

  public setGame(game: GameService): void
  {
    this.game = game;
  }

  public PieceOf(location: Point): Piece | undefined
  {
    if (!location.valid())
    {
      throw new Error(`Location: ${location.x},${location.y} is out of range of the board.`);
    }
    return this.box[location.x][location.y];
  }

  setPiece(point: Point, piece: Piece): void
  {
    if (this.PieceOf(point))
    {
      throw new Error(`Piece already in Position ${point}`);
    }
    if (!this.context)
    {
      throw new Error('Failed to set piece: Canvas context is null.');
    }
    const x = point.x;
    const y = point.y;
    this.context.beginPath();
    this.context.arc(15 + x * 30, 15 + y * 30, 13, 0, 2 * Math.PI); // 绘制棋子
    const g = this.context.createRadialGradient(15 + x * 30, 15 + y * 30, 13, 15 + x * 30, 15 + y * 30, 0); // 设置渐变
    if (piece === Piece.black)
    {
      g.addColorStop(0, '#0A0A0A'); // 黑棋
      g.addColorStop(1, '#636766');
    }
    else
    {
      g.addColorStop(0, '#D1D1D1'); // 白棋
      g.addColorStop(1, '#F9F9F9');
    }
    this.context.fillStyle = g;
    this.context.fill();
    this.context.closePath();
    this.box[x][y] = piece;
    this.pieceLock = !this.pieceLock;

  }

  reset(): void
  {
    if (!this.context)
    {
      return;
    }
    this.context.clearRect(0, 0, 450, 450);
    this.drawBoard();
  }

  drawBoard(): void
  {
    if (!this.context)
    {
      throw new Error('Failed to initialize the board: Canvas context creation is failed');
    }
    for (let i = 0; i < 15; i++)
    {
      this.box[i] = [];
      for (let j = 0; j < 15; j++)
      {
        this.box[i][j] = undefined; // 初始值为0
      }
      this.context.strokeStyle = '#D6D1D1';
      this.context.moveTo(15 + i * 30, 15); // 垂直方向画15根线，相距30px;
      this.context.lineTo(15 + i * 30, 435);
      this.context.stroke();
      this.context.moveTo(15, 15 + i * 30); // 水平方向画15根线，相距30px;棋盘为14*14；
      this.context.lineTo(435, 15 + i * 30);
      this.context.stroke();
    }

  }



  initialize(game: GameService): void
  {
    this.game = game;
    this.context = this.canvas?.getContext('2d');

    this.drawBoard();
    if (!this.canvas)
    {
      throw new Error('Failed to initialize the board: Canvas context creation is failed');
    }
    this.canvas.onclick = (e: MouseEvent) =>
    {
      if (!this.game)
      {
        this.msg.addWarning('游戏尚未开始。');
        return;
      }
      if (this.pieceLock)
      {

        this.msg.addWarning('正在等待对方下棋。');
        return;
      }
      const pos = new Point(
        Math.floor(e.offsetX / 30),
        Math.floor(e.offsetY / 30)
      );
      if (this.PieceOf(pos))
      {
        this.msg.addWarning('该位置已经有棋子。');
        return;
      }
      this.game.setPiece(pos);
    };
  }
}
