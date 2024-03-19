import Chess from 'core/chess';

export default class DOMHandler {
	// Round summary
	private static _opponentSelect: HTMLSelectElement;

	private static _turnText: HTMLParagraphElement;

	private static _whiteScore: HTMLParagraphElement;
	private static _blackScore: HTMLParagraphElement;

	private static _whitePiecesBox: HTMLDivElement;
	private static _blackPiecesBox: HTMLDivElement;

	private static _restartButton: HTMLButtonElement;

	// Timer
	private static _timerButton: HTMLButtonElement;
	private static _timerASpan: HTMLSpanElement;
	private static _timerBSpan: HTMLSpanElement;

	// *** METHODS *** //

	public static initialize(chess: Chess, initializeGame: CallableFunction, intializeAI: CallableFunction) {
		/// -- ROUND SUMMARY -- ///

		// Opponent chooser
		DOMHandler._opponentSelect = document.getElementById('opponent-chooser') as HTMLSelectElement;
		DOMHandler._opponentSelect.onchange = () => {
			intializeAI();
		};

		// Turn text
		DOMHandler._turnText = document.getElementById('turn') as HTMLParagraphElement;

		// Score Elements
		DOMHandler._whiteScore = document.getElementById('white-score') as HTMLParagraphElement;
		DOMHandler._whiteScore.textContent = '0';

		DOMHandler._blackScore = document.getElementById('black-score') as HTMLParagraphElement;
		DOMHandler._blackScore.textContent = '0';

		// Pieces boxes
		DOMHandler._whitePiecesBox = document.getElementById('white-pieces') as HTMLDivElement;
		DOMHandler._blackPiecesBox = document.getElementById('black-pieces') as HTMLDivElement;

		// Restart Button
		DOMHandler._restartButton = document.getElementById('restart') as HTMLButtonElement;
		DOMHandler._restartButton.onclick = () => {
			initializeGame();
		};

		/// -- TIMER -- ///

		// Timer values
		DOMHandler._timerASpan = document.getElementById('player-timer') as HTMLSpanElement;
		DOMHandler._timerBSpan = document.getElementById('opponent-timer') as HTMLSpanElement;

		// Timer A
		let timerAUpButton = document.getElementById('up-A') as HTMLButtonElement;
		timerAUpButton.onclick = () => {
			chess.timer.millisA += 10000;
			DOMHandler.updateTimerTextes(chess);
		};

		let timerADownButton = document.getElementById('down-A') as HTMLButtonElement;
		timerADownButton.onclick = () => {
			chess.timer.millisA -= 10000;
			DOMHandler.updateTimerTextes(chess);
		};

		// Timer B
		let timerBUpButton = document.getElementById('up-B') as HTMLButtonElement;
		timerBUpButton.onclick = () => {
			chess.timer.millisB += 10000;
			DOMHandler.updateTimerTextes(chess);
		};

		let timerBDownButton = document.getElementById('down-B') as HTMLButtonElement;
		timerBDownButton.onclick = () => {
			chess.timer.millisB -= 10000;
			DOMHandler.updateTimerTextes(chess);
		};

		// Timer button
		DOMHandler._timerButton = document.getElementById('start-timer') as HTMLButtonElement;
		DOMHandler._timerButton.onclick = () => {
			chess.timer.start();
		};
	}

	public static update(chess: Chess) {
		DOMHandler._turnText.textContent = chess.turn.toString();

		DOMHandler._whiteScore.textContent = chess.whiteScore.toString();
		DOMHandler._blackScore.textContent = chess.blackScore.toString();

		// White pieces
		let whitePiecesHTML = '';
		chess.piecesEatenByWhite.forEach((piece) => {
			console.log('Adding: ' + piece.toString());
			let icon = '<i class="fa-solid fa-chess-' + piece.type.toLowerCase() + '"></i>';
			whitePiecesHTML += icon;
		});
		DOMHandler._whitePiecesBox.innerHTML = whitePiecesHTML;

		// White pieces
		let blackPiecesHTML = '';
		chess.piecesEatenByBlack.forEach((piece) => {
			console.log('Adding: ' + piece.toString());
			let icon = '<i class="fa-regular fa-chess-' + piece.type.toLowerCase() + '"></i>';
			blackPiecesHTML += icon;
		});
		DOMHandler._blackPiecesBox.innerHTML = blackPiecesHTML;
	}

	// *** GETTERS *** //

	public static get opponentSelector() {
		return DOMHandler._opponentSelect;
	}

	// *** UTILITIES *** //

	public static updateTimerTextes(chess: Chess) {
		DOMHandler._timerASpan.innerText = chess.timer.timeA();
		DOMHandler._timerBSpan.innerText = chess.timer.timeB();
	}
}
