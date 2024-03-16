import * as p5 from "p5";
import Chess from "./core/chess";
import ChessState from "./util/chess.state";
import { PieceColor } from "./core/piece";
import IChessAI from "./algorithms/chess.ai";
import RandomChessAI from "./algorithms/random.chess.ai";

export const sketch = (p: p5) => {
  // *** Sketch Variables *** //

  // Main Chess Object
  let chess: Chess;
  let chessAI: IChessAI;

  // Mouse offset to render selected piece relative to where it has been picked
  let dragOffsetX: number;
  let dragOffsetY: number;

  // Round summary textes
  let turnText: HTMLParagraphElement;
  let whiteScore: HTMLParagraphElement;
  let blackScore: HTMLParagraphElement;
  let opponentSelect: HTMLSelectElement;
  let restartButton: HTMLButtonElement;

  // Timer
  let timerButton: HTMLButtonElement;
  let timerASpan: HTMLSpanElement;
  let timerBSpan: HTMLSpanElement;

  // *** P5 Functions *** //

  p.setup = () => {
    // Creating Canvas
    p.createCanvas(ChessState.BOARD_DIMENSION, ChessState.BOARD_DIMENSION);
    p.windowResized();

    initializeHTMLElements();
    initializeGame(); // Start the game
  };

  p.draw = () => {
    // Update
    if (chessAI != null) chessAI.update();
    updateTimer();

    // Render
    p.background(0);
    chess.render();
  };

  p.mousePressed = (event) => {
    if (chess.timer.isStarted) {
      let file = Math.floor((p.mouseX / p.width) * ChessState.FILES_RANKS);
      let rank = Math.floor((p.mouseY / p.width) * ChessState.FILES_RANKS);

      if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
        chess.pick(file, rank);

        dragOffsetX = file * ChessState.TILE_DIMENSION - p.mouseX;
        dragOffsetY = rank * ChessState.TILE_DIMENSION - p.mouseY;

        chess.drag(p.mouseX, p.mouseY, dragOffsetX, dragOffsetY);
      }
    }
  };

  p.mouseDragged = (event) => {
    chess.drag(p.mouseX, p.mouseY, dragOffsetX, dragOffsetY);
  };

  p.mouseReleased = (event) => {
    let file = Math.floor((p.mouseX / p.width) * ChessState.FILES_RANKS);
    let rank = Math.floor((p.mouseY / p.width) * ChessState.FILES_RANKS);
    chess.release(file, rank);

    updateHTMLElements();
  };

  p.windowResized = (event) => {
    const SPAN = 350; //px
    if (innerWidth >= innerHeight + SPAN)
      ChessState.windowResizeCallback(innerHeight * 0.7);
    else ChessState.windowResizeCallback(innerWidth * 0.5);
    p.resizeCanvas(ChessState.BOARD_DIMENSION, ChessState.BOARD_DIMENSION);
  };

  // *** UTILITIES *** //

  function initializeHTMLElements() {
    /// -- ROUND SUMMARY -- ///

    // Opponent chooser
    opponentSelect = document.getElementById(
      "opponent-chooser"
    ) as HTMLSelectElement;
    opponentSelect.onchange = () => {
      initializeChessAI();
    };

    // Turn text
    turnText = document.getElementById("turn") as HTMLParagraphElement;

    // Score Elements
    whiteScore = document.getElementById("white-score") as HTMLParagraphElement;
    whiteScore.textContent = "0";

    blackScore = document.getElementById("black-score") as HTMLParagraphElement;
    blackScore.textContent = "0";

    // Restart Button
    restartButton = document.getElementById("restart") as HTMLButtonElement;
    restartButton.onclick = () => {
      initializeGame();
    };

    /// -- TIMER -- ///

    // Timer values
    timerASpan = document.getElementById("player-timer") as HTMLSpanElement;
    timerBSpan = document.getElementById("opponent-timer") as HTMLSpanElement;

    // Timer A
    let timerAUpButton = document.getElementById("up-A") as HTMLButtonElement;
    timerAUpButton.onclick = () => {
      chess.timer.millisA += 10000;
      updateTimer();
    };

    let timerADownButton = document.getElementById(
      "down-A"
    ) as HTMLButtonElement;
    timerADownButton.onclick = () => {
      chess.timer.millisA -= 10000;
      updateTimer();
    };

    // Timer B
    let timerBUpButton = document.getElementById("up-B") as HTMLButtonElement;
    timerBUpButton.onclick = () => {
      chess.timer.millisB += 10000;
      updateTimer();
    };

    let timerBDownButton = document.getElementById(
      "down-B"
    ) as HTMLButtonElement;
    timerBDownButton.onclick = () => {
      chess.timer.millisB -= 10000;
      updateTimer();
    };

    // Timer button
    timerButton = document.getElementById("start-timer") as HTMLButtonElement;
    timerButton.onclick = () => {
      chess.timer.start();
    };
  }

  function updateHTMLElements() {
    turnText.textContent = chess.turn === PieceColor.WHITE ? "White" : "Black";

    whiteScore.textContent = chess.whiteScore.toString();
    blackScore.textContent = chess.blackScore.toString();
  }

  function updateTimer() {
    timerASpan.innerText = chess.timer.timeA();
    timerBSpan.innerText = chess.timer.timeB();
  }

  function initializeGame() {
    chess = new Chess(p, ChessState.DEFAULT_FEN);

    updateHTMLElements();
    initializeChessAI();
  }

  function initializeChessAI() {
    switch (opponentSelect.value) {
      case "second-player":
        chessAI = null;
        break;
      case "random-AI":
        chessAI = new RandomChessAI(chess, chess.opponentColor);
        break;
      default:
        throw new Error("Invalid Opponent selected!");
    }
  }
};

// Starting P5 Sketch
new p5(sketch, document.getElementById("chess"));
