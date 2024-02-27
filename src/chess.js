const FILES_RANKS = 8;
let dimMultiplier = 0.5;
let BOARD_DIMENSION = window.innerWidth * dimMultiplier;
let CELL_DIMENSION = BOARD_DIMENSION / FILES_RANKS;

const WHITE_COLOR = "#E1BE95";
const BLACK_COLOR = "#645442";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ALPHABET_REGEX = /[a-zA-Z]/;
const NUMBER_REGEX = /[0-9]/;

class Chess {
  constructor() {
    this.board = new Matrix(8, 8);
  }

  initialize(fenString) {
    // TODO: implement FEN regex

    let index = 0;
    Array.from(fenString).forEach((char) => {
      if (index < 64) {
        // Positioning pieces
        let file = index % 8;
        let rank = Math.floor(index / 8);

        if (ALPHABET_REGEX.test(char)) {
          this.board[file][rank] = Piece.createFromLetter(char);
          index++;
        } else if (NUMBER_REGEX.test(char)) {
          index += parseInt(char);
        } else if (char === "/") {
          while (index % 8 != 0) index++;
        }
      } else {
        // TODO: implement later
      }
    });
  }

  update() {}

  render(selectedPiece) {
    this.drawBoard();

    for (let file = 0; file < FILES_RANKS; file++) {
      for (let rank = 0; rank < FILES_RANKS; rank++) {
        if (this.board[file][rank] != null)
          this.board[file][rank].draw(file, rank);
      }
    }
  }

  // Getters and Setters

  getPiece(file, rank) {
    if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
    return this.board[file][rank];
  }

  setPiece(file, rank, piece) {
    this.board[file][rank] = piece;
  }

  isEmpty(file, rank) {
    return this.board[file][rank] == null;
  }

  // Rendering

  drawBoard() {
    for (let file = 0; file < FILES_RANKS; file++) {
      for (let rank = 0; rank < FILES_RANKS; rank++) {
        noStroke();

        if ((file + rank) % 2 == 0) fill(WHITE_COLOR);
        else fill(BLACK_COLOR);

        rect(
          file * CELL_DIMENSION,
          rank * CELL_DIMENSION,
          CELL_DIMENSION,
          CELL_DIMENSION
        );
      }
    }
  }

  // Utilities

  debugPrint() {
    let board = "";

    for (let rank = 0; rank < FILES_RANKS; rank++) {
      for (let file = 0; file < FILES_RANKS; file++) {
        let piece = this.board[file][rank];

        if (piece != null) board += piece.toLetter() + " ";
        else board += "  ";
      }
      board += "\n";
    }

    console.log(board);
  }
}
