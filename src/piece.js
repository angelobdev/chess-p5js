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

    this.texture = loadImage("assets/" + this.color + "_" + this.type + ".png");
  }

  draw(file, rank) {
    let cellDim = BOARD_DIMENSION / 8;
    image(this.texture, file * cellDim, rank * cellDim, cellDim, cellDim);
  }

  drawFree(x, y) {
    let cellDim = BOARD_DIMENSION / 8;
    image(this.texture, x, y, cellDim, cellDim);
  }

  calculatePossibleMoves(chess, file, rank) {
    let moves = [];

    let direction = this.color === PieceColor.black ? 1 : -1;

    switch (this.type) {
      // PAWN
      case PieceType.pawn:
        let span = this.hasMoved ? 1 : 2;

        for (let i = 1; i < span + 1; i++) {
          let move = {
            moveFile: file,
            moveRank: rank + direction * i,
          };
          moves.push(move);
        }

        // TODO: Add eat moves if front left/right diagonal has a piece in it
        break;
      // ROOK
      case PieceType.rook:
        // Adding horizontal left
        for (let hl = file - 1; hl >= 0; hl--) {
          if (!chess.isEmpty(hl, rank)) break;
          moves.push({ moveFile: hl, moveRank: rank });
        }

        // Adding horizontal right
        for (let hr = file + 1; hr < 8; hr++) {
          if (!chess.isEmpty(hr, rank)) break;
          moves.push({ moveFile: hr, moveRank: rank });
        }

        // Adding vertical top
        for (let vt = rank - 1; vt >= 0; vt--) {
          if (!chess.isEmpty(file, vt)) break;
          moves.push({ moveFile: file, moveRank: vt });
        }

        // Adding vertical bottom
        for (let vb = rank + 1; vb < 8; vb++) {
          if (!chess.isEmpty(file, vb)) break;
          moves.push({ moveFile: file, moveRank: vb });
        }

        break;
      // KNIGHT
      case PieceType.knight:
        break;
      // BISHOP
      case PieceType.bishop:
        // Main diagonal

        // Inverse diagonal
        break;
      // QUEEN
      case PieceType.queen:
        break;
      // KING
      case PieceType.king:
        break;
    }

    return moves;
  }

  hasBeenMoved() {
    this.hasMoved = true;
  }

  toString() {
    return this.color + " " + this.type;
  }

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

  // UTILITY FUNCTION
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
