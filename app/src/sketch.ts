import p5 from "p5";
import IChessAI from "./algorithms/chess.ai";
import RandomChessAI from "./algorithms/random.chess.ai";
import Chess from "./core/chess";
import { PieceColor, PieceType } from "./core/piece";
import ChessState from "./util/chess.state";

const canvasID = "display";

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
    p.createCanvas(ChessState.BOARD_DIMENSION, ChessState.BOARD_DIMENSION).id(
      canvasID
    );
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

    if (!chess.timer.isStarted) {
      let rectHeight = 80;
      let rectSpan = 20;

      p.fill(255);
      p.rect(
        rectSpan,
        p.height / 2 - rectHeight,
        p.width - 2 * rectSpan,
        2 * rectHeight,
        10
      );

      p.textAlign("center");
      p.fill(0);
      p.textSize(p.width / 20);
      p.text("Press play to start the game!", p.width / 2, p.height / 2);
    }
  };

  p.mousePressed = (event: Event) => {
    if (event.target === document.getElementById(canvasID)) {
      // console.log("Mouse pressed at %1.2f, %1.2f", p.mouseX, p.mouseY);

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

      // Preventing scroll
      event.preventDefault();
    }
  };

  p.mouseDragged = (event: Event) => {
    if (event.target === document.getElementById(canvasID)) {
      // console.log("Mouse dragged at %1.2f, %1.2f", p.mouseX, p.mouseY);
      chess.drag(p.mouseX, p.mouseY, dragOffsetX, dragOffsetY);

      // Preventing scroll
      event.preventDefault();
    }
  };

  p.mouseReleased = (event: Event) => {
    if (event.target === document.getElementById(canvasID)) {
      let file = Math.floor((p.mouseX / p.width) * ChessState.FILES_RANKS);
      let rank = Math.floor((p.mouseY / p.width) * ChessState.FILES_RANKS);
  
      if (chess.selectedPiece && chess.selectedPiece.type === PieceType.KING) {
        // If the selected piece is a king, check if the move is an attempted castling
        const kingFile = chess.selectedPiece.file;
        const targetFile = file;
  
        // Check if the player is trying to castle
        if (Math.abs(targetFile - kingFile) === 2) {
          // Determine the rook's file based on the direction of the castling
          const rookFile = targetFile > kingFile ? 7 : 0;
          const rook = chess.getPieceAt(rookFile, rank);
  
          // Try to perform the castling
          if (chess.tryCastle(chess.selectedPiece, rook, targetFile, rank)) {
            // Successful castling
            chess.selectedPiece.selected = false;
            chess.selectedPiece = null;
            updateHTMLElements();
            return;
          }
        }
      }
  
      // If it's not a castling move, proceed with the regular move
      chess.release(file, rank);
      updateHTMLElements();
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
    turnText.textContent = chess.turn.toString();

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
