import {Piece} from './piece.enum';

export interface Game
{
  /**
   * 玩家1(黑棋)的Websocket Id
   */
  player1Id: string;
  /**
   * 玩家2(白棋)的Websocket Id
   */
  player2Id: string;

  player1Ready: boolean;
  player2Ready: boolean;
}
