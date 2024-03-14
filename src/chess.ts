import { FILES_RANKS, TILE_DIMENSION } from "./constants";
import Move, { calculatePossibleMoves } from "./movement";
import Piece, { PieceColor, PieceType } from "./piece";


export default class Chess {
  // *** FIELDS ***

  public static p: p5;

  private pieces: Array<Piece>;
  private selectedPiece: Piece = null;

  private dragX: number = 0;
  private dragY: number = 0;

  private turn: PieceColor;

  // *** CONSTRUCTOR ***

  constructor(p: p5, fen: string) {
    // Initializing P5
    Chess.p = p;

    // Initializing Pieces Array
    this.pieces = new Array<Piece>();

    // Parsing FEN String
    let index = 0;
    for (let ci = 0; ci < fen.length; ci++) {
      let symbol = fen.charAt(ci);

      if (index < 64) {
        // Placing pieces
        let file = index % FILES_RANKS;
        let rank = Math.floor(index / FILES_RANKS);

        if (symbol.match("[a-zA-Z]")) {
          let piece = new Piece(symbol);
          piece.setPosition(file, rank);

          this.pieces.push(piece);
          index++;
        } else if (symbol.match("[0-9]")) {
          index += Number(symbol);
        } else {
          // TODO: implement
        }
      }
      // Settings
      else {
        this.turn = PieceColor.WHITE; // TODO: implement into parser
      }
    }
  }

  // *** METHODS ***

  render() {
    // Rendering board
    for (let file = 0; file < FILES_RANKS; file++) {
        for (let rank = 0; rank < FILES_RANKS; rank++) {
            Chess.p.noStroke();
            Chess.p.fill((file + rank) % 2 == 0 ? "#E1BE95" : "#645442");
            Chess.p.rect(
                file * TILE_DIMENSION,
                rank * TILE_DIMENSION,
                TILE_DIMENSION,
                TILE_DIMENSION
            );
        }
    }

    // Get current turn and check if the king is under check
    let turn = this.getTurn();
    let kingUnderCheck = this.isKingUnderCheck(turn);

    // Rendering pieces
    this.pieces.forEach((piece) => {
        piece.render(turn, kingUnderCheck);
    });

    // Rendering drag piece
    if (this.selectedPiece != null) {
        this.selectedPiece.renderFree(this.dragX, this.dragY);
    }
  }


  pick(file: number, rank: number) {
    // console.log("Picking at %d %d", file, rank);
    this.selectedPiece = this.getPieceAt(file, rank);

    if (this.selectedPiece.color != this.turn) this.selectedPiece = null;

    // console.log("Picked " + this.selectedPiece);
    if (this.selectedPiece != null) {
      this.selectedPiece.selected = true;
      this.selectedPiece.recalculateMoves(this);
    }
  }

  drag(x: number, y: number, pickOffsetX: number, pickOffsetY: number) {
    // console.log("Dragging at %f %f", x, y);
    if (this.selectedPiece != null) {
      this.dragX = x + pickOffsetX;
      this.dragY = y + pickOffsetY;
    }
  }

  release(file: number, rank: number) {
    // console.log("Releasing at %d %d", file, rank);

    if (this.selectedPiece != null) {
      let pieceAtReleaseSpot = this.getPieceAt(file, rank);

      if (
        pieceAtReleaseSpot != null &&
        pieceAtReleaseSpot != this.selectedPiece &&
        this.selectedPiece.canMoveTo(file, rank)
      ) {
        // Moving into a non-empty spot (Eating)
        this.pieces = this.pieces.filter((piece) => {
          return piece != pieceAtReleaseSpot;
        });
      }

      if (this.selectedPiece.moveTo(file, rank)) {
        this.turn =
          this.turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
      }
      this.selectedPiece.selected = false;
      this.selectedPiece = null;
    }
  }

  // *** UTILITIES ***

    /**
   * Checks if the king of the specified color is under check.
   * @param color The color of the king to check.
   * @returns True if the king is under check, false otherwise.
   */
  public isKingUnderCheck(color: PieceColor): boolean {
    // Find the position of the king of the specified color
    let king = this.pieces.find(piece => piece.type === PieceType.KING && piece.color === color);

    if (king) {
        // Iterate through all pieces of the opposite color
        for (let piece of this.pieces) {
            if (piece.color !== color) {
                // Calculate possible moves for the current piece
                let possibleMoves = calculatePossibleMoves(this, piece);

                // Check if any of the possible moves hits the king
                for (let move of possibleMoves) {
                    if (move.toFile === king.file && move.toRank === king.rank) {
                        // The king is under check
                        return true;
                    }
                }
            }
        }
    }

    // The king is not under check
    return false;
  }

  // Get Functions

  getPieceAt(file: number, rank: number): Piece {
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];

      if (piece.isPlacedAt(file, rank)) {
        return piece;
      }
    }

    return null;
  }

  public getSelectedPiece(): Piece {
    return this.selectedPiece;
  }

  public getTurn(): PieceColor {
    return this.turn;
  }
}
