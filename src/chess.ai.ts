import Chess from "./chess";
import Piece, { PieceColor } from "./piece";
import Move from "./piece.movement";

export interface ChessAIMove {
  piece: Piece;
  file: number;
  rank: number;
}

export abstract class IChessAI {
  protected _chess: Chess;
  protected _playerColor: PieceColor;

  constructor(chess: Chess, playerColor: PieceColor) {
    this._chess = chess;
    this._playerColor = playerColor;
  }

  update() {
    if (this._chess.turn === this._playerColor) {
      // AI makes move
      let move = this.generateNextMove();
      console.log("Making move...");
      move.piece.moveTo(move.file, move.rank);
      this._chess.nextTurn();
    }
  }

  abstract generateNextMove(): ChessAIMove;
}

// Various Algorithms here:
// ...

export class RandomChessAI extends IChessAI {
  pickRandomMovablePiece(): Piece {
    let sameColorPieces = this._chess.pieces.filter((piece) => {
      return (
        piece.color === this._playerColor &&
        piece.getPossibleMoves(this._chess).length > 0
      );
    });

    let randomIndex = Math.floor(Math.random() * (sameColorPieces.length + 1));
    return sameColorPieces.at(randomIndex);
  }

  pickRandomMove(piece: Piece): Move {
    let moves = piece.getPossibleMoves(this._chess);
    console.log("Possible moves: " + moves.length);

    let randomIndex = Math.floor(Math.random() * (moves.length + 1));
    return moves.at(randomIndex);
  }

  generateNextMove(): ChessAIMove {
    let piece = this.pickRandomMovablePiece();
    console.log("Piece: " + piece.toString());

    let move = this.pickRandomMove(piece);
    console.log("Move: " + move);

    return {
      piece: piece,
      file: move.toFile,
      rank: move.toRank,
    } as ChessAIMove;
  }
}
