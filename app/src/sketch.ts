import p5 from 'p5';
import IChessAI from './algorithms/chess.ai';
import RandomChessAI from './algorithms/random.chess.ai';
import Chess from './core/chess';
import ChessState from './static/chess.state';
import DOMHandler from './static/dom.handler';

export const sketch = (p: p5) => {
	// *** Sketch Variables *** //

	// Canvas options
	let canvasID = 'display';

	// Main Chess Object
	let chess: Chess;
	let chessAI: IChessAI;

	// Mouse offset to render selected piece relative to where it has been picked
	let dragOffsetX: number;
	let dragOffsetY: number;

	// *** P5 Functions *** //

	p.setup = () => {
		// Creating Canvas
		let canvas = p.createCanvas(ChessState.BOARD_DIMENSION, ChessState.BOARD_DIMENSION);
		canvas.id(canvasID);
		p.windowResized();

		// Starting the game
		chess = new Chess(p, ChessState.CURRENT_FEN);

		// Initializing DOM Elements
		DOMHandler.initialize(chess, initializeGame, () => {
			initializeChessAI(DOMHandler.opponentSelector);
		});
	};

	p.draw = () => {
		// Update
		if (chessAI != null) chessAI.update();
		DOMHandler.updateTimerTextes(chess);

		// Render
		p.background(0);
		chess.render();
	};

	p.mousePressed = (event: Event) => {
		if (event.target === document.getElementById(canvasID)) {
			// console.log("Mouse pressed at %1.2f, %1.2f", p.mouseX, p.mouseY);

			if (chess.timer.isStarted) {
				let file = getCursorFile();
				let rank = getCursorRank();

				if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
					// Trying to pick the piece in the selected spot
					chess.pickCallback(file, rank);

					dragOffsetX = file * ChessState.TILE_DIMENSION - p.mouseX;
					dragOffsetY = rank * ChessState.TILE_DIMENSION - p.mouseY;

					chess.dragCallback(p.mouseX, p.mouseY, dragOffsetX, dragOffsetY);
				}
			}

			// Preventing scroll
			event.preventDefault();
		}
	};

	p.mouseDragged = (event: Event) => {
		if (event.target === document.getElementById(canvasID)) {
			// console.log("Mouse dragged at %1.2f, %1.2f", p.mouseX, p.mouseY);

			// Trying to drag the piece in the selected spot
			chess.dragCallback(p.mouseX, p.mouseY, dragOffsetX, dragOffsetY);

			// Preventing scroll
			event.preventDefault();
		}
	};

	p.mouseReleased = (event: Event) => {
		if (event.target === document.getElementById(canvasID)) {
			// Trying to move the piece in the selected spot
			chess.releaseCallback(getCursorFile(), getCursorRank());

			// Updating DOM elements
			DOMHandler.update(chess);

			// Preventing scroll
			event.preventDefault();
		}
	};

	p.windowResized = (event) => {
		if (innerWidth > 1600) {
			ChessState.windowResizeCallback(innerWidth * 0.42);
		} else if (innerWidth > 900) {
			ChessState.windowResizeCallback(innerWidth * 0.5);
		} else {
			ChessState.windowResizeCallback(innerWidth * 0.86);
		}

		// Resizing
		p.resizeCanvas(ChessState.BOARD_DIMENSION, ChessState.BOARD_DIMENSION);
	};

	p.touchStarted = (event: Event) => {
		p.mousePressed(event);
	};

	p.touchMoved = (event: Event) => {
		p.mouseDragged(event);
	};

	p.touchEnded = (event: Event) => {
		p.mouseReleased(event);
	};

	/// *** UTILITIES *** ///

	function initializeGame() {
		chess = new Chess(p, ChessState.CURRENT_FEN);

		DOMHandler.update(chess);
		initializeChessAI(DOMHandler.opponentSelector);
	}

	function initializeChessAI(selector: HTMLSelectElement) {
		switch (selector.value) {
			case 'second-player':
				chessAI = null;
				break;
			case 'random-AI':
				chessAI = new RandomChessAI(chess, chess.opponentColor);
				break;
			default:
				throw new Error('Invalid Opponent selected!');
		}
	}

	function getCursorFile() {
		return Math.floor((p.mouseX / p.width) * ChessState.FILES_RANKS_COUNT);
	}

	function getCursorRank() {
		return Math.floor((p.mouseY / p.width) * ChessState.FILES_RANKS_COUNT);
	}
};
