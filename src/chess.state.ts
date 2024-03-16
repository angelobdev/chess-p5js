export default class ChessState {
  public static DEFAULT_FEN =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // Standard FEN

  public static FILES_RANKS = 8; // Number of files and ranks
  public static BOARD_DIMENSION = 600; // Dimension of the board (in pixels)
  public static TILE_DIMENSION =
    ChessState.BOARD_DIMENSION / ChessState.FILES_RANKS; // Dimension of the tile (in pixels)

  public static OVERLAY_COLOR = "#00ff0020"; // Overlay color displayed on possible moves (tiles) of the selected piece

  public static windowResizeCallback(newSize: number) {
    ChessState.BOARD_DIMENSION = newSize; // The 0.48 value refers to the CSS values of the containers (80vh * 60%)
    ChessState.TILE_DIMENSION =
      ChessState.BOARD_DIMENSION / ChessState.FILES_RANKS;
  }
}
