import * as p5 from "p5";
import Chess from "./chess";
import { OVERLAY_COLOR, TILE_DIMENSION } from "./constants";
import Move, { calculatePossibleMoves } from "./movement";


export enum PieceColor {
  WHITE = "white",
  BLACK = "black",
}

export enum PieceType {
  PAWN = "pawn",
  ROOK = "rook",
  KNIGHT = "knight",
  BISHOP = "bishop",
  QUEEN = "queen",
  KING = "king",
}

export default class Piece {
  // Logic
  private _type: PieceType;
  private _color: PieceColor;

  private _file: number;
  private _rank: number;

  private _hasMoved: boolean;
  private _possibleMoves: Array<Move>;

  // Rendering
  private _texture: p5.Image;
  public selected: boolean;

  // *** CONSTRUCTOR ***
  constructor(symbol: string) {
    this._type = Piece.getPieceTypeFromSymbol(symbol);
    this._color = Piece.getPieceColorFromSymbol(symbol);

    this._file = 0;
    this._rank = 0;

    this._hasMoved = false;

    // Getting texture file name
    let textureFileName = "assets/" + this._color + "_" + this._type + ".png";

    // Loading textures
    this._texture = Chess.p.loadImage(textureFileName, null, () => {
      console.log("Failed to load the texture!");
    });

    this.selected = false;
  }

  // *** METHODS ***

  public render(turn: PieceColor, kingUnderCheck: boolean) {
    // Render the piece's texture
    if (!this.selected) {
        Chess.p.image(
            this._texture,
            this._file * TILE_DIMENSION,
            this._rank * TILE_DIMENSION,
            TILE_DIMENSION,
            TILE_DIMENSION
        );
    }

    // Highlight the square of the king if it's under check
    if (this._type === PieceType.KING && this._color === turn && kingUnderCheck) {
        Chess.p.fill("#ff000080"); // Red with 50% opacity
        Chess.p.rect(
            this._file * TILE_DIMENSION,
            this._rank * TILE_DIMENSION,
            TILE_DIMENSION,
            TILE_DIMENSION
        );
    }
  }

  public renderFree(x: number, y: number) {
    if (this.selected) {
      // Rendering possible moves
      this._possibleMoves.forEach((move) => {
        // Draw overlay for each possible move
        Chess.p.fill(OVERLAY_COLOR); // Set overlay color
        Chess.p.rect(
          move.toFile * TILE_DIMENSION,
          move.toRank * TILE_DIMENSION,
          TILE_DIMENSION,
          TILE_DIMENSION
        ); // Draw overlay rectangle
      });

      // Rendering piece
      Chess.p.image(this._texture, x, y, TILE_DIMENSION, TILE_DIMENSION);
    }
  }

  public recalculateMoves(chess: Chess) {
    this._possibleMoves = calculatePossibleMoves(chess, this);
  }

  // *** GETTERS AND SETTERS ***

  public get file(): number {
    return this._file;
  }

  public get rank(): number {
    return this._rank;
  }

  public get color(): PieceColor {
    return this._color;
  }

  public get type(): PieceType {
    return this._type;
  }

  public get hasMoved() {
    return this._hasMoved;
  }

  public moveTo(file: number, rank: number): boolean {
    if (this.canMoveTo(file, rank)) {
      this.setPosition(file, rank);
      this._hasMoved = true;
      return true;
    }
    return false;
  }

  public canMoveTo(file: number, rank: number) {
    if (file === this._file && rank === this._rank) return false;
    for (let i = 0; i < this._possibleMoves.length; i++) {
      let move = this._possibleMoves[i];
      if (move.toFile === file && move.toRank === rank) {
        return true;
      }
    }
    return false;
  }

  public setPosition(file: number, rank: number) {
    this._file = file;
    this._rank = rank;
  }

  public isPlacedAt(file: number, rank: number) {
    if (this._file === file && this._rank === rank) return true;
    return false;
  }

  // *** UTILITIES ***

  private static getPieceTypeFromSymbol(symbol: string): PieceType {
    switch (symbol.toLowerCase()) {
      case "p":
        return PieceType.PAWN;
      case "r":
        return PieceType.ROOK;
      case "n":
        return PieceType.KNIGHT;
      case "b":
        return PieceType.BISHOP;
      case "q":
        return PieceType.QUEEN;
      case "k":
        return PieceType.KING;
      default:
        throw new Error("Invalid symbol: " + symbol);
    }
  }

  private static getPieceColorFromSymbol(symbol: string): PieceColor {
    return symbol === symbol.toUpperCase()
      ? PieceColor.WHITE
      : PieceColor.BLACK;
  }
}
