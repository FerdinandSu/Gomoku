export interface Game {
  /**
   * 玩家1(黑棋)的Websocket Id
   */
  player1Id: string;
  /**
   * 玩家2(白棋)的Websocket Id
   */
  player2Id: string;

  /**
   * 游戏id
   */
  id: string;
}
