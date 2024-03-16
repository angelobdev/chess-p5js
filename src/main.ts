import * as p5 from "p5";
import Chess from "./chess";
import ChessState from "./chess.state";
import { PieceColor } from "./piece";

export const sketch = (p: p5) => {
  // *** Sketch Variables *** //

  // Main Chess Object
  let chess: Chess;

  // Mouse offset to render selected piece relative to where it has been picked
  let dragOffsetX: number;
  let dragOffsetY: number;

  // Round summary textes
  let turnText: HTMLParagraphElement;
  let whiteScore: HTMLParagraphElement;
  let blackScore: HTMLParagraphElement;
  let restartButton: HTMLButtonElement;

  // *** P5 Functions *** //

  p.setup = () => {
    // Creating Canvas
    p.createCanvas(ChessState.BOARD_DIMENSION, ChessState.BOARD_DIMENSION);
    p.windowResized();

    initializeHTMLElements();
    start(); // Start the game
  };

  p.draw = () => {
    p.background(0);
    chess.render();
  };

  p.mousePressed = (event) => {
    let file = Math.floor((p.mouseX / p.width) * ChessState.FILES_RANKS);
    let rank = Math.floor((p.mouseY / p.width) * ChessState.FILES_RANKS);

    if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
      chess.pick(file, rank);

      dragOffsetX = file * ChessState.TILE_DIMENSION - p.mouseX;
      dragOffsetY = rank * ChessState.TILE_DIMENSION - p.mouseY;

      chess.drag(p.mouseX, p.mouseY, dragOffsetX, dragOffsetY);
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
    ChessState.windowResizeCallback(window.innerWidth);
    p.resizeCanvas(ChessState.BOARD_DIMENSION, ChessState.BOARD_DIMENSION);
  };

  // *** UTILITIES *** //

  function initializeHTMLElements() {
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
      start();
    };
  }

  function updateHTMLElements() {
    turnText.textContent = chess.turn === PieceColor.WHITE ? "White" : "Black";

    whiteScore.textContent = chess.whiteScore.toString();
    blackScore.textContent = chess.blackScore.toString();
  }

  function start() {
    chess = new Chess(p, ChessState.DEFAULT_FEN);
    updateHTMLElements();
  }
};

// Starting P5 Sketch
new p5(sketch, document.getElementById("chess"));
