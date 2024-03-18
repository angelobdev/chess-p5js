import Chess from "../core/chess";
import Piece, { PieceColor } from "../core/piece";

export interface ChessAIMove {
  piece: Piece;
  file: number;
  rank: number;
}

export default abstract class IChessAI {
  protected _chess: Chess;
  protected _playerColor: PieceColor;

  constructor(chess: Chess, playerColor: PieceColor) {
    this._chess = chess;
    this._playerColor = playerColor;
  }

  /**
   * Updates the ChessAI and tries to make a move when its turn comes.
   */
  public update() {
    if (this._chess.turn === this._playerColor) {
      // AI makes move
      let move = this.generateNextMove();
      this._chess.tryMove(move.piece, move.file, move.rank);
    }
  }

  /**
   * Function to be implemented to make the ChessAI work.
   */
  abstract generateNextMove(): ChessAIMove;
}
