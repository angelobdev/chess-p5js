// Constants for the chessboard dimensions
const FILES_RANKS = 8;
let dimMultiplier = 0.5;
let BOARD_DIMENSION = window.innerWidth * dimMultiplier; // Board dimension based on window width
let CELL_DIMENSION = BOARD_DIMENSION / FILES_RANKS; // Cell dimension based on board dimension and number of files/ranks

// Colors for chessboard squares
const WHITE_COLOR = "#E1BE95";
const BLACK_COLOR = "#645442";

// Default FEN string for initial board setup
const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

// Regular expressions for parsing FEN strings
const ALPHABET_REGEX = /[a-zA-Z]/;
const NUMBER_REGEX = /[0-9]/;

// Overlay color for highlighting possible moves
const OVERLAY_COLOR = "#00ff0020";

// Class representing the chess game
class Chess {
  constructor() {
    this.board = new Matrix(8, 8); // Initialize the board as an 8x8 matrix
    this.turn = PieceColor.white;
  }

  // Initialize the board with pieces based on a FEN string
  initialize(fenString) {
    let index = 0;
    Array.from(fenString).forEach((char) => {
      if (index < 64) {
        // Positioning pieces on the board
        let file = index % 8;
        let rank = Math.floor(index / 8);

        if (ALPHABET_REGEX.test(char)) {
          this.board[file][rank] = Piece.createFromLetter(char); // Create piece from FEN character and place it on the board
          index++;
        } else if (NUMBER_REGEX.test(char)) {
          index += parseInt(char); // Skip empty squares based on the number in the FEN string
        } else if (char === "/") {
          while (index % 8 != 0) index++; // Move to the next rank in the FEN string
        }
      } else {
        // TODO: implement later (handling of other FEN information like turn, castling, etc.)
        if (char === "w" || char === "b") {
          this.turn = char === "w" ? PieceColor.white : PieceColor.black;
        }
      }
    });
  }

  // Render the chessboard and pieces
  render() {
    this.drawBoard(); // Draw the chessboard

    // Draw pieces on the board
    for (let file = 0; file < FILES_RANKS; file++) {
      for (let rank = 0; rank < FILES_RANKS; rank++) {
        if (this.board[file][rank] != null)
          this.board[file][rank].draw(file, rank); // Draw piece if present on the board
      }
    }
  }

  // Getters and Setters

  // Get piece at a specific file and rank
  getPiece(file, rank) {
    if (file < 0 || file > 7 || rank < 0 || rank > 7) return null; // Check if coordinates are within board bounds
    return this.board[file][rank];
  }

  // Set piece at a specific file and rank
  setPiece(file, rank, piece) {
    this.board[file][rank] = piece;
  }

  // Check if a square is empty
  isEmpty(file, rank) {
    if (file < 0 || file > 7 || rank < 0 || rank > 7) return true; // Check if coordinates are within board bounds
    return this.board[file][rank] === null;
  }

  // Rendering

  // Draw the chessboard with alternating colors
  drawBoard() {
    for (let file = 0; file < FILES_RANKS; file++) {
      for (let rank = 0; rank < FILES_RANKS; rank++) {
        noStroke();

        // Alternate between white and black squares
        if ((file + rank) % 2 == 0) fill(WHITE_COLOR);
        else fill(BLACK_COLOR);

        // Draw square
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

  // Print the current state of the board to the console (for debugging)
  debugPrint() {
    let board = "";

    for (let rank = 0; rank < FILES_RANKS; rank++) {
      for (let file = 0; file < FILES_RANKS; file++) {
        let piece = this.board[file][rank];

        if (piece != null) board += piece.toLetter() + " ";
        // Add piece letter to the board string
        else board += "  "; // Add empty space if no piece present
      }
      board += "\n"; // Add new line after each rank
    }

    console.log(board); // Log the board string to the console
  }
}
