const PieceColor = {
  black: "black",
  white: "white",
};

const PieceType = {
  pawn: "pawn",
  rook: "rook",
  knight: "knight",
  bishop: "bishop",
  queen: "queen",
  king: "king",
};

class Piece {
  constructor(pieceType, pieceColor) {
    this.type = pieceType;
    this.color = pieceColor;

    this.hasMoved = false;

    // Load the texture for the piece based on its type and color
    this.texture = loadImage("assets/" + this.color + "_" + this.type + ".png");
  }

  // Draw the piece on the board at the given file and rank
  draw(file, rank) {
    let cellDim = BOARD_DIMENSION / 8;
    image(this.texture, file * cellDim, rank * cellDim, cellDim, cellDim);
  }

  // Draw the piece freely at the given coordinates
  drawFree(x, y) {
    let cellDim = BOARD_DIMENSION / 8;
    image(this.texture, x, y, cellDim, cellDim);
  }

  // Calculate the possible moves for the piece
  calculatePossibleMoves(chess, file, rank) {
    let moves = [];

    // Determine the direction of movement based on the piece's color
    let direction = this.color === PieceColor.black ? 1 : -1;

    switch (this.type) {
      // PAWN
      case PieceType.pawn:
        let span = this.hasMoved ? 1 : 2;

        // Check if there is a piece in front of the pawn
        let frontPiece = chess.getPiece(file, rank + direction);
        if (frontPiece === null) {
          for (let i = 1; i < span + 1; i++) {
            let move = {
              moveFile: file,
              moveRank: rank + direction * i,
            };
            moves.push(move);
          }
        }

        // Add moves to eat opponent's pieces on the front diagonals
        let leftDiagonalFile = file - 1;
        let rightDiagonalFile = file + 1;

        // Check the front left diagonal
        if (leftDiagonalFile >= 0) {
          let pieceLeftDiagonal = chess.getPiece(
            leftDiagonalFile,
            rank + direction
          );
          if (
            pieceLeftDiagonal !== null &&
            pieceLeftDiagonal.color !== this.color
          ) {
            moves.push({
              moveFile: leftDiagonalFile,
              moveRank: rank + direction,
            });
          }
        }

        // Check the front right diagonal
        if (rightDiagonalFile < 8) {
          let pieceRightDiagonal = chess.getPiece(
            rightDiagonalFile,
            rank + direction
          );
          if (
            pieceRightDiagonal !== null &&
            pieceRightDiagonal.color !== this.color
          ) {
            moves.push({
              moveFile: rightDiagonalFile,
              moveRank: rank + direction,
            });
          }
        }
        break;

      // ROOK
      case PieceType.rook:
        // Add horizontal and vertical moves
        this.addHorizontalAndVerticalMoves(chess, file, rank, moves);
        break;

      // KNIGHT
      case PieceType.knight:
        // Calculate knight moves
        const knightMoves = [
          { moveFile: file + 2, moveRank: rank + 1 },
          { moveFile: file + 2, moveRank: rank - 1 },
          { moveFile: file - 2, moveRank: rank + 1 },
          { moveFile: file - 2, moveRank: rank - 1 },
          { moveFile: file + 1, moveRank: rank + 2 },
          { moveFile: file + 1, moveRank: rank - 2 },
          { moveFile: file - 1, moveRank: rank + 2 },
          { moveFile: file - 1, moveRank: rank - 2 },
        ];

        // Check each knight move and add it if valid
        knightMoves.forEach((move) => {
          let piece = chess.getPiece(move.moveFile, move.moveRank);
          if (piece === null || piece.color !== this.color) {
            moves.push(move);
          }
        });
        break;

      // BISHOP
      case PieceType.bishop:
        // Add diagonal moves
        this.addDiagonalMoves(chess, file, rank, moves);
        break;

      // QUEEN
      case PieceType.queen:
        // Add horizontal, vertical, and diagonal moves
        this.addHorizontalAndVerticalMoves(chess, file, rank, moves);
        this.addDiagonalMoves(chess, file, rank, moves);
        break;

      // KING
      case PieceType.king:
        // Calculate king moves
        const kingMoves = [
          { moveFile: file + 1, moveRank: rank },
          { moveFile: file + 1, moveRank: rank + 1 },
          { moveFile: file, moveRank: rank + 1 },
          { moveFile: file - 1, moveRank: rank + 1 },
          { moveFile: file - 1, moveRank: rank },
          { moveFile: file - 1, moveRank: rank - 1 },
          { moveFile: file, moveRank: rank - 1 },
          { moveFile: file + 1, moveRank: rank - 1 },
        ];

        // Check each king move and add it if valid
        kingMoves.forEach((move) => {
          let piece = chess.getPiece(move.moveFile, move.moveRank);
          if (piece === null || piece.color !== this.color) {
            moves.push(move);
          }
        });
        break;
    }

    return moves;
  }

  // Add horizontal and vertical moves to the moves array
  addHorizontalAndVerticalMoves(chess, file, rank, moves) {
    // Add horizontal moves to the left
    for (let hl = file - 1; hl >= 0; hl--) {
      let piece = chess.getPiece(hl, rank);
      if (piece === null) {
        moves.push({ moveFile: hl, moveRank: rank });
      } else {
        if (piece.color !== this.color) {
          moves.push({ moveFile: hl, moveRank: rank });
        }
        break;
      }
    }

    // Add horizontal moves to the right
    for (let hr = file + 1; hr < 8; hr++) {
      let piece = chess.getPiece(hr, rank);
      if (piece === null) {
        moves.push({ moveFile: hr, moveRank: rank });
      } else {
        if (piece.color !== this.color) {
          moves.push({ moveFile: hr, moveRank: rank });
        }
        break;
      }
    }

    // Add vertical moves upwards
    for (let vt = rank - 1; vt >= 0; vt--) {
      let piece = chess.getPiece(file, vt);
      if (piece === null) {
        moves.push({ moveFile: file, moveRank: vt });
      } else {
        if (piece.color !== this.color) {
          moves.push({ moveFile: file, moveRank: vt });
        }
        break;
      }
    }

    // Add vertical moves downwards
    for (let vb = rank + 1; vb < 8; vb++) {
      let piece = chess.getPiece(file, vb);
      if (piece === null) {
        moves.push({ moveFile: file, moveRank: vb });
      } else {
        if (piece.color !== this.color) {
          moves.push({ moveFile: file, moveRank: vb });
        }
        break;
      }
    }
  }

  // Add diagonal moves to the moves array
  addDiagonalMoves(chess, file, rank, moves) {
    // Add diagonal moves top-left
    for (let i = 1; i < 8; i++) {
      let newFile = file - i;
      let newRank = rank - i;
      if (newFile < 0 || newRank < 0) break;
      let piece = chess.getPiece(newFile, newRank);
      if (piece === null) {
        moves.push({ moveFile: newFile, moveRank: newRank });
      } else {
        if (piece.color !== this.color) {
          moves.push({ moveFile: newFile, moveRank: newRank });
        }
        break;
      }
    }

    // Add diagonal moves top-right
    for (let i = 1; i < 8; i++) {
      let newFile = file + i;
      let newRank = rank - i;
      if (newFile >= 8 || newRank < 0) break;
      let piece = chess.getPiece(newFile, newRank);
      if (piece === null) {
        moves.push({ moveFile: newFile, moveRank: newRank });
      } else {
        if (piece.color !== this.color) {
          moves.push({ moveFile: newFile, moveRank: newRank });
        }
        break;
      }
    }

    // Add diagonal moves bottom-left
    for (let i = 1; i < 8; i++) {
      let newFile = file - i;
      let newRank = rank + i;
      if (newFile < 0 || newRank >= 8) break;
      let piece = chess.getPiece(newFile, newRank);
      if (piece === null) {
        moves.push({ moveFile: newFile, moveRank: newRank });
      } else {
        if (piece.color !== this.color) {
          moves.push({ moveFile: newFile, moveRank: newRank });
        }
        break;
      }
    }

    // Add diagonal moves bottom-right
    for (let i = 1; i < 8; i++) {
      let newFile = file + i;
      let newRank = rank + i;
      if (newFile >= 8 || newRank >= 8) break;
      let piece = chess.getPiece(newFile, newRank);
      if (piece === null) {
        moves.push({ moveFile: newFile, moveRank: newRank });
      } else {
        if (piece.color !== this.color) {
          moves.push({ moveFile: newFile, moveRank: newRank });
        }
        break;
      }
    }
  }

  // Mark the piece as moved
  hasBeenMoved() {
    this.hasMoved = true;
  }

  // Return a string representation of the piece
  toString() {
    return this.color + " " + this.type;
  }

  // Return a single-letter representation of the piece
  toLetter() {
    let letter = "";

    switch (this.type) {
      case PieceType.pawn:
        letter = "p";
        break;
      case PieceType.rook:
        letter = "r";
        break;
      case PieceType.knight:
        letter = "n";
        break;
      case PieceType.bishop:
        letter = "b";
        break;
      case PieceType.queen:
        letter = "q";
        break;
      case PieceType.king:
        letter = "k";
        break;
    }

    if (this.color == PieceColor.white) return letter.toUpperCase();
    return letter;
  }

  // Static method to create a Piece instance from a single-letter representation
  static createFromLetter(letter) {
    let color =
      letter === letter.toUpperCase() && letter !== letter.toLowerCase()
        ? PieceColor.white
        : PieceColor.black;

    let type;
    switch (letter.toLowerCase()) {
      case "p":
        type = PieceType.pawn;
        break;
      case "r":
        type = PieceType.rook;
        break;
      case "n":
        type = PieceType.knight;
        break;
      case "b":
        type = PieceType.bishop;
        break;
      case "q":
        type = PieceType.queen;
        break;
      case "k":
        type = PieceType.king;
        break;
      default:
        throw Error("Invalid piece letter: " + letter);
    }

    return new Piece(type, color);
  }
}
