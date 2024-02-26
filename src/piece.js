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
