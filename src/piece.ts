import * as p5 from "p5";
import Chess from "./chess";
import Move, { calculatePossibleMoves } from "./piece.movement";
import ChessState from "./chess.state";

// #region Enumerators

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

// #endregion

export default class Piece {
  // *** FIELDS *** //

  // Logic
  private _type: PieceType;
  private _color: PieceColor;
  private _value: number;

  private _file: number;
  private _rank: number;

  private _hasMoved: boolean;
  private _possibleMoves: Array<Move>;

  // Rendering
  private _texture: p5.Image;
  private _selected: boolean;

  // *** CONSTRUCTOR *** //

  constructor(symbol: string) {
    // Initializing piece
    this._type = Piece.getPieceTypeFromSymbol(symbol);
    this._color = Piece.getPieceColorFromSymbol(symbol);
    this._value = Piece.getPieceValueFromSymbol(symbol);

    // Initializing piece position
    this._file = 0;
    this._rank = 0;

    this._hasMoved = false;

    // Getting texture file name
    let textureFileName = "assets/" + this._color + "_" + this._type + ".png";

    // Loading textures
    this._texture = Chess.p.loadImage(textureFileName, null, () => {
      console.log("Failed to load the texture!");
    });

    // Initially no piece is selected
    this._selected = false;
  }

  // *** METHODS *** //

  /**
   * Draws the piece in the (file, rank) position
   */
  public render() {
    if (!this._selected) {
      Chess.p.image(
        this._texture,
        this._file * ChessState.TILE_DIMENSION,
        this._rank * ChessState.TILE_DIMENSION,
        ChessState.TILE_DIMENSION,
        ChessState.TILE_DIMENSION
      );
    }
  }

  /**
   * Draws the piece in the (x, y) position
   * @param x Horizontal coordinate (from top left) to draw the piece
   * @param y Vertical coordinate (from top left) to draw the piece
   */
  public renderFree(x: number, y: number) {
    if (this._selected) {
      // Rendering possible moves
      this._possibleMoves.forEach((move) => {
        // Draw overlay for each possible move
        Chess.p.fill(ChessState.OVERLAY_COLOR); // Set overlay color
        Chess.p.rect(
          move.toFile * ChessState.TILE_DIMENSION,
          move.toRank * ChessState.TILE_DIMENSION,
          ChessState.TILE_DIMENSION,
          ChessState.TILE_DIMENSION
        ); // Draw overlay rectangle
      });

      // Rendering piece
      Chess.p.image(
        this._texture,
        x,
        y,
        ChessState.TILE_DIMENSION,
        ChessState.TILE_DIMENSION
      );
    }
  }

  /**
   * Recalculates the possible moves that the piece can make
   * @param chess
   */
  public recalculateMoves(chess: Chess) {
    this._possibleMoves = calculatePossibleMoves(chess, this);
  }

  /**
   * Tries to move the piece in the specified (file, rank) position.
   * The success of the operation depends on the possible moves that the piece can make.
   * @param file
   * @param rank
   * @returns
   */
  public moveTo(file: number, rank: number): boolean {
    if (this.canMoveTo(file, rank)) {
      this.setPosition(file, rank);
      this._hasMoved = true;
      return true;
    }
    return false;
  }

  /**
   * Returns true if the piece can be moved to the (file, rank) position
   * @param file
   * @param rank
   * @returns
   */
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

  /**
   * Returns true if the piece is placed in the (file, rank) position
   * @param file
   * @param rank
   * @returns
   */
  public isPlacedAt(file: number, rank: number) {
    if (this._file === file && this._rank === rank) return true;
    return false;
  }

  // *** GETTERS *** //

  public get color(): PieceColor {
    return this._color;
  }

  public get type(): PieceType {
    return this._type;
  }

  public get value(): number {
    return this._value;
  }

  public get file(): number {
    return this._file;
  }

  public get rank(): number {
    return this._rank;
  }

  public get selected(): boolean {
    return this._selected;
  }

  public get hasMoved(): boolean {
    return this._hasMoved;
  }

  // *** SETTERS *** //

  public set selected(selected: boolean) {
    this._selected = selected;
  }

  public setPosition(file: number, rank: number) {
    this._file = file;
    this._rank = rank;
  }

  // *** UTILITIES *** //

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

  private static getPieceValueFromSymbol(symbol: string): number {
    switch (symbol.toLowerCase()) {
      case "p":
        return 1;
      case "r":
        return 5;
      case "n":
        return 3;
      case "b":
        return 3;
      case "q":
        return 9;
      case "k":
        return 1000;
      default:
        throw new Error("Invalid symbol: " + symbol);
    }
  }

  // *** DEBUG FUNCTIONS *** //

  public toString(): string {
    return this._color.toString() + " " + this._type.toString();
  }
}
