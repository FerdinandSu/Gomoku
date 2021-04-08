import {Injectable} from '@angular/core';
import {Piece} from './models/piece.enum';

@Injectable({
  providedIn: 'root'
})
export class GameService
{
  get oppositePiece(): Piece
  {
    if (!this._oppoPiece)
    {
      throw new Error('游戏尚未初始化。');
    }
    return this._oppoPiece;
  }

  get myPiece(): Piece
  {
    if (!this._myPiece)
    {
      throw new Error('游戏尚未初始化。');
    }
    return this._myPiece;
  }

  private _myPiece: Piece | undefined;
  private _oppoPiece: Piece | undefined;


  constructor()
  {
  }
}
