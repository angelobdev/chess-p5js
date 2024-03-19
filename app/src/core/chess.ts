import ChessState from "../util/chess.state";
import ChessTimer from "../util/chess.timer";
import Piece, { PieceColor } from "./piece";

export default class Chess {
  // *** FIELDS *** //

  public static p: p5;

  private _pieces: Array<Piece>;
  private _selectedPiece: Piece;

  private _piecesEatenByWhite: Array<Piece>;
  private _piecesEatenByBlack: Array<Piece>;

  private _dragX: number;
  private _dragY: number;

  private _turn: PieceColor;
  private _firstTurn: PieceColor;

  private _timer: ChessTimer;

  // *** CONSTRUCTOR *** //

  constructor(p: p5, fen: string) {
    // Initializing P5
    Chess.p = p;

    // Initializing Fields
    this._pieces = new Array<Piece>();
    this._selectedPiece = null;

    this._piecesEatenByWhite = new Array<Piece>();
    this._piecesEatenByBlack = new Array<Piece>();

    this._dragX = 0;
    this._dragY = 0;

    this._turn = PieceColor.WHITE;
    this._firstTurn = this._turn;

    this._timer = new ChessTimer(300000, 300000);

    // Parsing FEN string
    this.parseFen(fen);
  }

  // *** METHODS *** //

  /**
   * Renders board and pieces
   */
  public render() {
    // Rendering board
    for (let file = 0; file < ChessState.FILES_RANKS; file++) {
      for (let rank = 0; rank < ChessState.FILES_RANKS; rank++) {
        Chess.p.noStroke();
        Chess.p.fill(
          (file + rank) % 2 == 0
            ? ChessState.WHITE_COLOR
            : ChessState.BLACK_COLOR
        );
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

    // Rendering file letters
    Chess.p.textSize(Chess.p.width / 30);

    for (let file = 0; file < ChessState.FILES_RANKS; file++) {
      Chess.p.fill(0);
      Chess.p.text(
        String.fromCharCode(97 + file),
        (file + 0.85) * ChessState.TILE_DIMENSION,
        ChessState.BOARD_DIMENSION * 0.99
      );
    }

    // Rendering rank numbers
    for (let rank = 0; rank < ChessState.FILES_RANKS; rank++) {
      Chess.p.fill(0);
      Chess.p.text(
        8 - rank,
        0.1 * ChessState.TILE_DIMENSION,
        (rank + 0.3) * ChessState.TILE_DIMENSION
      );
    }
  }

  /**
   * Callback that selects (if possible) the piece in the [file, rank] position
   * @param file
   * @param rank
   */
  public pick(file: number, rank: number) {
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
  public drag(x: number, y: number, pickOffsetX: number, pickOffsetY: number) {
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
  public release(file: number, rank: number) {
    // console.log("Releasing at %d %d", file, rank);
    if (this._selectedPiece != null) {
      this.tryMove(this._selectedPiece, file, rank);
      this._selectedPiece.selected = false;
      this._selectedPiece = null;
    }
  }

  public tryMove(piece: Piece, file: number, rank: number) {
    let pieceAtReleaseSpot = this.getPieceAt(file, rank);
  
    if (
      pieceAtReleaseSpot != null &&
      pieceAtReleaseSpot != piece &&
      piece.canMoveTo(file, rank)
    ) {
      // Moving into a non-empty spot (Eating)
      this._pieces = this._pieces.filter((p) => {
        return p != pieceAtReleaseSpot;
      });
  
      // Eating
      if (piece.color === PieceColor.WHITE) {
        this._piecesEatenByWhite.push(pieceAtReleaseSpot);
      } else {
        this._piecesEatenByBlack.push(pieceAtReleaseSpot);
      }
    }
  
    // Trying to perform the move
    if (piece.moveTo(this, file, rank)) { // Passa un'istanza di Chess come primo parametro
      this._turn =
        this._turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
  
      this.timer.switch();
    }
  }  

  public set selectedPiece(piece: Piece | null) {
    this._selectedPiece = piece;
  }

  // *** GETTERS *** //

  public get pieces(): Array<Piece> {
    return this._pieces;
  }

  public get turn(): PieceColor {
    return this._turn;
  }

  public get timer(): ChessTimer {
    return this._timer;
  }

  public get playerColor(): PieceColor {
    return this._firstTurn;
  }

  public get opponentColor(): PieceColor {
    return this._firstTurn === PieceColor.WHITE
      ? PieceColor.BLACK
      : PieceColor.WHITE;
  }

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

  public get selectedPiece(): Piece | null {
    return this._selectedPiece;
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

  public tryCastle(king: Piece, rook: Piece, targetFile: number, targetRank: number): boolean {
    // Check if the king and rook are in their initial positions
    if (!king.hasMoved && !rook.hasMoved) {
        // Determine the direction of the castling (castle to right or left)
        let direction = targetFile > king.file ? 1 : -1;

        // Check if there are no pieces between the king and the rook
        let intermediateFiles = direction === 1 ? [king.file + 1, king.file + 2] : [king.file - 1, king.file - 2];
        for (let file of intermediateFiles) {
            if (this.getPieceAt(file, king.rank)) {
                return false; // Castle is invalid if there is a piece in the path
            }
        }

        // Check if the king is under check or crosses a square under attack
        let squaresToCheck = direction === 1 ? [king.file, king.file + 1, king.file + 2] : [king.file - 2, king.file - 1, king.file];
        for (let file of squaresToCheck) {
            if (this.isSquareUnderAttack(file, king.rank, king.color)) {
                return false; // Castle is invalid if the king is under check or crosses a square under attack
            }
        }

        // Determine the final file for the king and rook
        let finalKingFile = king.file + (2 * direction); // Move the king two squares towards the rook
        let finalRookFile = targetFile - direction; // Move the rook next to the king

        // Move the king and rook
        king.setPosition(finalKingFile, targetRank);
        rook.setPosition(finalRookFile, targetRank);

        return true; // Successful castle
    }

    return false; // Castle is invalid if the king or rook has already moved
  }

  public isSquareUnderAttack(file: number, rank: number, color: PieceColor): boolean {
    // Iterate through all opponent's pieces and check if they can move to the square
    // or if the square is within the attack range of an opponent's piece
    for (let piece of this.pieces) {
      if (piece.color !== color) {
        let possibleMoves = piece.getPossibleMoves(this);
        for (let move of possibleMoves) {
          if (move.toFile === file && move.toRank === rank) {
            return true; // Square is under attack
          }
        }
      }
    }
    return false; // Is not under attack
  }
}
