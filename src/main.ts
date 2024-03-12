import * as p5 from "p5";
import Chess from "./chess";
import ChessState from "./chess.state";

export const sketch = (p: p5) => {
  // *** Sketch Variables *** //

  let chess: Chess;

  // Mouse offset to render selected piece relative to where it has been picked
  let dragOffsetX: number;
  let dragOffsetY: number;

  // FEN String tracker
  let fenString: string;

  // *** P5 Functions *** //

  p.setup = () => {
    // Creating Canvas
    p.createCanvas(ChessState.BOARD_DIMENSION, ChessState.BOARD_DIMENSION);

    setupControlPanel();
    start(); // Initializes the chess object
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
  };

  p.windowResized = (event) => {
    // TODO: Rethink

    let MIN_DIM = 800;

    if (window.innerWidth > MIN_DIM)
      ChessState.BOARD_DIMENSION = window.innerWidth * 0.6;
    else ChessState.BOARD_DIMENSION = MIN_DIM / 2;

    ChessState.TILE_DIMENSION =
      ChessState.BOARD_DIMENSION / ChessState.FILES_RANKS;

    p.resizeCanvas(ChessState.BOARD_DIMENSION, ChessState.BOARD_DIMENSION);
  };

  // *** UTILITIES *** //

  function start() {
    // Creating Chess object
    chess = new Chess(p, ChessState.DEFAULT_FEN);
  }

  function setupControlPanel() {
    // Control Panel
    let fenInput = document.getElementById(
      "fen-string-input"
    ) as HTMLInputElement;

    fenInput.value = ChessState.DEFAULT_FEN; // Set default FEN value
    fenInput.onchange = function () {
      fenString = fenInput.value; // Update fenString when input changes
      start(); // Restart the game with the new FEN string
    };
    fenString = fenInput.value; // Initialize fenString with default value

    let fenButton = document.getElementById("restart-button"); // Get restart button element
    fenButton.onclick = function () {
      start(); // Restart the game when the button is clicked
    };
  }
};

// Starting P5 Sketch
new p5(sketch, document.getElementById("chess"));
