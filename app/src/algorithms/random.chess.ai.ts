import Piece from "../core/piece";
import Move from "../core/piece.movement";
import IChessAI, { ChessAIMove } from "./chess.ai";

export default class RandomChessAI extends IChessAI {
  pickRandomMovablePiece(): Piece {
    let sameColorPieces = this._chess.pieces.filter((piece) => {
      return (
        piece.color === this._playerColor &&
        piece.getPossibleMoves(this._chess).length > 0
      );
    });

    let randomIndex = Math.floor(Math.random() * sameColorPieces.length);
    return sameColorPieces.at(randomIndex);
  }

  pickRandomMove(piece: Piece): Move {
    let moves = piece.getPossibleMoves(this._chess);
    let randomIndex = Math.floor(Math.random() * moves.length);
    return moves.at(randomIndex);
  }

  generateNextMove(): ChessAIMove {
    let piece = this.pickRandomMovablePiece();
    let move = this.pickRandomMove(piece);

    return {
      piece: piece,
      file: move.toFile,
      rank: move.toRank,
    } as ChessAIMove;
  }
}
