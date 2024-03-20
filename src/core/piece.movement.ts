import Chess from './chess';
import Piece, { PieceColor, PieceType } from './piece';

export default interface Move {
	toFile: number;
	toRank: number;
}

// Calculate the possible moves for the piece
export function calculatePossibleMoves(chess: Chess, piece: Piece): Move[] {
	let moves: Move[] = [];

	// Helper function to check if a move is within the board boundaries
	function isValidMove(file: number, rank: number): boolean {
		return file >= 0 && file < 8 && rank >= 0 && rank < 8;
	}

	// Helper function to add a move to the list if it's valid
	function addMove(file: number, rank: number) {
		if (isValidMove(file, rank)) {
			let pieceAtMoveSlot = chess.getPieceAt(file, rank);
			if (pieceAtMoveSlot != null && pieceAtMoveSlot.color === piece.color) return;

			moves.push({ toFile: file, toRank: rank });
		}
	}

	// Helper function to check if there's a piece at the specified position
	function isOccupied(file: number, rank: number): boolean {
		return !!chess.getPieceAt(file, rank);
	}

	// Helper function to check if castling is possible
	function isCastlingPossible(king: Piece, rook: Piece, targetFile: number, _targetRank: number): boolean {
		// Check if the king and rook are in their initial positions
		if (!king.hasMoved && !rook.hasMoved) {
			// Determine the direction of the castling (castle to right or left)
			let direction = targetFile > king.file ? 1 : -1;

			// Check if there are no pieces between the king and the rook
			let intermediateFiles: number[] = [];
			if (direction === 1) {
				for (let file = king.file + 1; file < rook.file; file++) {
					intermediateFiles.push(file);
				}
			} else {
				for (let file = king.file - 1; file > rook.file; file--) {
					intermediateFiles.push(file);
				}
			}
			for (let file of intermediateFiles) {
				if (chess.getPieceAt(file, king.rank)) {
					return false; // Castle is invalid if there is a piece in the path
				}
			}

			// Check if the king is under check or crosses a square under attack
			let squaresToCheck = direction === 1 ? [king.file, king.file + 1, king.file + 2] : [king.file - 2, king.file - 1, king.file];
			for (let file of squaresToCheck) {
				if (chess.isSquareUnderAttack(file, king.rank, king.color)) {
					return false; // Castle is invalid if the king is under check or crosses a square under attack
				}
			}

			// Castling is possible
			return true;
		}
		// Castle is invalid if the king or rook has already moved
		return false;
	}

	// Calculate possible moves based on the piece type
	switch (piece.type) {
		case PieceType.PAWN:
			// Pawn moves differently based on its color
			let direction = piece.color === PieceColor.WHITE ? -1 : 1;

			// Forward move
			if (!isOccupied(piece.file, piece.rank + direction)) {
				addMove(piece.file, piece.rank + direction);

				// Double forward move on first move
				if (!piece.hasMoved && !isOccupied(piece.file, piece.rank + 2 * direction)) {
					addMove(piece.file, piece.rank + 2 * direction);
				}
			}

			// Diagonal captures
			for (let offset of [-1, 1]) {
				let targetFile = piece.file + offset;
				let targetRank = piece.rank + direction;
				if (isValidMove(targetFile, targetRank) && isOccupied(targetFile, targetRank)) {
					let targetPiece = chess.getPieceAt(targetFile, targetRank);
					if (targetPiece.color !== piece.color) {
						addMove(targetFile, targetRank);
					}
				}
			}
			break;

		case PieceType.ROOK:
			// Rook moves horizontally and vertically
			for (let i of [-1, 1]) {
				for (let j = 1; j < 8; j++) {
					let targetFile = piece.file + i * j;
					let targetRank = piece.rank;
					if (isValidMove(targetFile, targetRank)) {
						if (!isOccupied(targetFile, targetRank)) {
							addMove(targetFile, targetRank);
						} else {
							if (chess.getPieceAt(targetFile, targetRank).color !== piece.color) {
								addMove(targetFile, targetRank);
							}
							break;
						}
					} else {
						break;
					}
				}
				for (let j = 1; j < 8; j++) {
					let targetFile = piece.file;
					let targetRank = piece.rank + i * j;
					if (isValidMove(targetFile, targetRank)) {
						if (!isOccupied(targetFile, targetRank)) {
							addMove(targetFile, targetRank);
						} else {
							if (chess.getPieceAt(targetFile, targetRank).color !== piece.color) {
								addMove(targetFile, targetRank);
							}
							break;
						}
					} else {
						break;
					}
				}
			}
			break;

		case PieceType.KNIGHT:
			// Knight moves in L-shape (2 squares in one direction, 1 in the other)
			for (let dx of [-1, 1]) {
				for (let dy of [-2, 2]) {
					addMove(piece.file + dx, piece.rank + dy);
					addMove(piece.file + dy, piece.rank + dx);
				}
			}
			break;

		case PieceType.BISHOP:
			// Bishop moves diagonally
			for (let dx of [-1, 1]) {
				for (let dy of [-1, 1]) {
					for (let i = 1; i < 8; i++) {
						let targetFile = piece.file + i * dx;
						let targetRank = piece.rank + i * dy;
						if (isValidMove(targetFile, targetRank)) {
							if (!isOccupied(targetFile, targetRank)) {
								addMove(targetFile, targetRank);
							} else {
								if (chess.getPieceAt(targetFile, targetRank).color !== piece.color) {
									addMove(targetFile, targetRank);
								}
								break;
							}
						} else {
							break;
						}
					}
				}
			}
			break;

		case PieceType.QUEEN:
			// Queen moves horizontally, vertically, and diagonally (combining rook and bishop moves)
			for (let i of [-1, 1]) {
				for (let j = 1; j < 8; j++) {
					let targetFile = piece.file + i * j;
					let targetRank = piece.rank;
					if (isValidMove(targetFile, targetRank)) {
						if (!isOccupied(targetFile, targetRank)) {
							addMove(targetFile, targetRank);
						} else {
							if (chess.getPieceAt(targetFile, targetRank).color !== piece.color) {
								addMove(targetFile, targetRank);
							}
							break;
						}
					} else {
						break;
					}
				}
				for (let j = 1; j < 8; j++) {
					let targetFile = piece.file;
					let targetRank = piece.rank + i * j;
					if (isValidMove(targetFile, targetRank)) {
						if (!isOccupied(targetFile, targetRank)) {
							addMove(targetFile, targetRank);
						} else {
							if (chess.getPieceAt(targetFile, targetRank).color !== piece.color) {
								addMove(targetFile, targetRank);
							}
							break;
						}
					} else {
						break;
					}
				}
			}
			for (let dx of [-1, 1]) {
				for (let dy of [-1, 1]) {
					for (let i = 1; i < 8; i++) {
						let targetFile = piece.file + i * dx;
						let targetRank = piece.rank + i * dy;
						if (isValidMove(targetFile, targetRank)) {
							if (!isOccupied(targetFile, targetRank)) {
								addMove(targetFile, targetRank);
							} else {
								if (chess.getPieceAt(targetFile, targetRank).color !== piece.color) {
									addMove(targetFile, targetRank);
								}
								break;
							}
						} else {
							break;
						}
					}
				}
			}
			break;

		case PieceType.KING:
			// King moves one square in any direction
			for (let dx of [-1, 0, 1]) {
				for (let dy of [-1, 0, 1]) {
					if (dx !== 0 || dy !== 0) {
						addMove(piece.file + dx, piece.rank + dy);
					}
				}
			}

			// Castling
			if (!piece.hasMoved) {
				// Check castling on the king side
				let kingSideRook = chess.getPieceAt(7, piece.rank);
				if (kingSideRook && kingSideRook.type === PieceType.ROOK && !kingSideRook.hasMoved) {
					if (isCastlingPossible(piece, kingSideRook, piece.file + 2, piece.rank)) {
						addMove(piece.file + 2, piece.rank); // Add castling move
					}
				}

				// Check castling on the queen side
				let queenSideRook = chess.getPieceAt(0, piece.rank);
				if (queenSideRook && queenSideRook.type === PieceType.ROOK && !queenSideRook.hasMoved) {
					if (isCastlingPossible(piece, queenSideRook, piece.file - 2, piece.rank)) {
						addMove(piece.file - 2, piece.rank); // Add castling move
					}
				}
			}
			break;

		default:
			break;
	}

	return moves;
}
