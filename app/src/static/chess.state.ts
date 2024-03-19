export default class ChessState {
	// *** FIELDS *** //

	// Logic values
	private static _currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

	// Rendering values
	private static _boardDimension = 600; // Dimension of the board (in pixels)
	private static _filesRanksCount = 8; // Number of files and ranks

	// Colors
	private static _whiteColor = '#E7D4B5';
	private static _blackColor = '#AD8768';
	private static _overlayColor = '#00ff0020'; // Overlay color displayed on possible moves (tiles) of the selected piece

	// Getters

	public static get CURRENT_FEN() {
		return ChessState._currentFen; // Standard FEN
	}

	public static get BOARD_DIMENSION() {
		return ChessState._boardDimension;
	}

	public static get FILES_RANKS_COUNT() {
		return ChessState._filesRanksCount;
	}

	public static get TILE_DIMENSION() {
		return ChessState._boardDimension / ChessState._filesRanksCount;
	}

	public static get WHITE_COLOR() {
		return ChessState._whiteColor;
	}

	public static get BLACK_COLOR() {
		return ChessState._blackColor;
	}

	public static get OVERLAY_COLOR() {
		return ChessState._overlayColor;
	}

	// Callbacks

	public static windowResizeCallback(newSize: number) {
		ChessState._boardDimension = newSize; // The 0.48 value refers to the CSS values of the containers (80vh * 60%)
	}
}
