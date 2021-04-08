import {Direction} from './direction.enum';
import {Piece} from './piece.enum';

export class Point
{
  x: number;
  y: number;

  constructor(x: number, y: number)
  {
    this.x = x;
    this.y = y;
  }

  private static inRange(direction: Direction, range: Direction[])
  {
    for (const d of range)
    {
      if (d === direction)
      {
        return true;
      }
    }
    return false;
  }

  public valid(): boolean
  {
    return this.x >= 0 && this.x < 15
      && this.y >= 0 && this.y < 15;
  }

  next(direction: Direction): Point
  {
    const deltaX = Point.inRange(direction, [Direction.west, Direction.southwest, Direction.northwest]) ? // 4或5，对应原值-1，-2，4，即向北
      -1 :
      Point.inRange(direction, [Direction.east, Direction.southeast, Direction.northeast]) ? // 0或3,对应正东正西或不动
        1 : 0;
    const deltaY =
      Point.inRange(direction, [Direction.north, Direction.northeast, Direction.northwest]) ? // 4或5，对应原值-1，-2，4，即向北
        -1 :
        Point.inRange(direction, [Direction.south, Direction.southeast, Direction.southwest]) ? // 0或3,对应正东正西或不动
          1 : 0;
    return new Point(this.x + deltaX, this.y + deltaY);

  }
}
