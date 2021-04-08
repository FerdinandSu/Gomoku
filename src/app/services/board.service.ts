import {Injectable} from '@angular/core';
import {Piece} from '../models/piece.enum';
import {Point} from '../models/point';

@Injectable({
  providedIn: 'root'
})
export class BoardService
{

  public context: CanvasRenderingContext2D | undefined | null;
  public canvas: HTMLCanvasElement | undefined;
  public box: (Piece | undefined)[][] = [];
  public pieceLock = false;

  constructor()
  {
  }


  private PieceOf(location: Point): Piece | undefined
  {
    if (location.x < 0 || location.x >= 15
      || location.y < 0 || location.y >= 15)
    {
      throw new Error(`Location: ${location} is out of range of the board.`);
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
    } else
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

  initialize(): void
  {

    this.context = this.canvas?.getContext('2d');
    if (!this.canvas || !this.context)
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
    this.canvas.onclick = (e) =>
    {

      const x = e.offsetX; // 相对于棋盘左上角的x坐标
      const y = e.offsetY; // 相对于棋盘左上角的y坐标
      const i = Math.floor(x / 30);
      const j = Math.floor(y / 30);
      if (box[i][j] === 0)
      {
        oneStep(i, j, me);
        if (me)
        {
          box[i][j] = 1;
        } else
        {
          box[i][j] = 2;
        }
        me = !me; // 下一步白棋
      }
    };
  }
}
