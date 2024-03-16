import ChessState from "./chess.state";
import Piece, { PieceColor } from "./piece";

export default class Chess {
  // *** FIELDS *** //

  public static p: p5;

  private _pieces: Array<Piece>;
  private _selectedPiece: Piece;

  private _piecesEatenByWhite: Array<Piece>;
  private _piecesEatenByBlack: Array<Piece>;

  private _dragX: number = 0;
  private _dragY: number = 0;

  private _turn: PieceColor;

  // *** CONSTRUCTOR *** //

  constructor(p: p5, fen: string) {
    // Initializing P5
    Chess.p = p;

    // Initializing Fields
    this._pieces = new Array<Piece>();
    this._selectedPiece = null;

    this._piecesEatenByWhite = new Array<Piece>();
    this._piecesEatenByBlack = new Array<Piece>();

    // Parsing FEN string
    this.parseFen(fen);
  }

  // *** METHODS *** //

  /**
   * Renders board and pieces
   */
  render() {
    // Rendering board
    for (let file = 0; file < ChessState.FILES_RANKS; file++) {
      for (let rank = 0; rank < ChessState.FILES_RANKS; rank++) {
        Chess.p.noStroke();
        Chess.p.fill((file + rank) % 2 == 0 ? "#E1BE95" : "#645442");
        Chess.p.rect(
          file * ChessState.TILE_DIMENSION,
          rank * ChessState.TILE_DIMENSION,
          ChessState.TILE_DIMENSION,
          ChessState.TILE_DIMENSION
        );
      }
    }

    // Rendering pieces
    this._pieces.forEach((piece) => {
      piece.render();
    });

    // Rendering drag piece
    if (this._selectedPiece != null) {
      this._selectedPiece.renderFree(this._dragX, this._dragY);
    }
  }

  /**
   * Callback that selects (if possible) the piece in the [file, rank] position
   * @param file
   * @param rank
   */
  pick(file: number, rank: number) {
    // console.log("Picking at %d %d", file, rank);
    this._selectedPiece = this.getPieceAt(file, rank);

    // console.log("Picked " + this.selectedPiece);
    if (this._selectedPiece != null) {
      if (this._selectedPiece.color != this._turn) {
        this._selectedPiece = null;
        return;
      }

      this._selectedPiece.selected = true;
      this._selectedPiece.recalculateMoves(this);
    }
  }

  /**
   * Callback that draws the selected piece in the specified coordinates
   * @param x
   * @param y
   * @param pickOffsetX
   * @param pickOffsetY
   */
  drag(x: number, y: number, pickOffsetX: number, pickOffsetY: number) {
    // console.log("Dragging at %f %f", x, y);
    if (this._selectedPiece != null) {
      this._dragX = x + pickOffsetX;
      this._dragY = y + pickOffsetY;
    }
  }

  /**
   * Callback that releases the piece in the specified [file, rank] position (if possible)
   * @param file
   * @param rank
   */
  release(file: number, rank: number) {
    // console.log("Releasing at %d %d", file, rank);

    if (this._selectedPiece != null) {
      let pieceAtReleaseSpot = this.getPieceAt(file, rank);

      if (
        pieceAtReleaseSpot != null &&
        pieceAtReleaseSpot != this._selectedPiece &&
        this._selectedPiece.canMoveTo(file, rank)
      ) {
        // Moving into a non-empty spot (Eating)
        this._pieces = this._pieces.filter((piece) => {
          return piece != pieceAtReleaseSpot;
        });

        // Eating
        if (pieceAtReleaseSpot.color === PieceColor.WHITE) {
          this._piecesEatenByWhite.push(pieceAtReleaseSpot);
        } else {
          this._piecesEatenByBlack.push(pieceAtReleaseSpot);
        }
      }

      if (this._selectedPiece.moveTo(file, rank)) {
        this._turn =
          this._turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
      }
      this._selectedPiece.selected = false;
      this._selectedPiece = null;
    }
  }

  // *** GETTERS *** //

  public get whiteScore(): number {
    return Chess.calculateScore(this._piecesEatenByWhite);
  }

  public get blackScore(): number {
    return Chess.calculateScore(this._piecesEatenByBlack);
  }

  public getPieceAt(file: number, rank: number): Piece {
    for (let i = 0; i < this._pieces.length; i++) {
      const piece = this._pieces[i];
      if (piece.isPlacedAt(file, rank)) return piece;
    }
    return null;
  }

  // *** UTILITIES *** //

  private static calculateScore(eatenPieces: Array<Piece>): number {
    let score: number = 0;
    eatenPieces.forEach((piece) => {
      score += piece.value;
    });
    return score;
  }

  private parseFen(fen: string) {
    // Example FEN:
    // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

    // Parsing FEN String
    let index = 0;
    for (let ci = 0; ci < fen.length; ci++) {
      let symbol = fen.charAt(ci);

      if (index < 64) {
        // Placing pieces
        let file = index % ChessState.FILES_RANKS;
        let rank = Math.floor(index / ChessState.FILES_RANKS);

        if (symbol.match("[a-zA-Z]")) {
          // Selecting piece based on symbol (letter)
          let piece = new Piece(symbol);
          piece.setPosition(file, rank);

          this._pieces.push(piece);
          index++;
        } else if (symbol.match("[0-9]")) {
          // Skipping 'n' places
          index += Number(symbol);
        } else {
          // TODO: implement
        }
      } else {
        // Applying settings
        this._turn = PieceColor.WHITE; // TODO: implement into parser
      }
    }
  }
}
