import * as p5 from "p5";
import Chess from "./chess";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DEFAULT_FEN,
  FILES_RANKS,
  TILE_DIMENSION,
} from "./constants";

export const sketch = (p: p5) => {
  let chess: Chess;

  // Mouse offset to render selected piece relative to where it has been picked
  let dragOffsetX: number;
  let dragOffsetY: number;

  // FEN String tracker
  let fenString: string;

  p.setup = () => {
    // Creating Canvas
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    // Control Panel
    let fenInput = document.getElementById(
      "fen-string-input"
    ) as HTMLInputElement;

    fenInput.value = DEFAULT_FEN; // Set default FEN value
    fenInput.onchange = function () {
      fenString = fenInput.value; // Update fenString when input changes
      start(); // Restart the game with the new FEN string
    };
    fenString = fenInput.value; // Initialize fenString with default value

    let fenButton = document.getElementById("restart-button"); // Get restart button element
    fenButton.onclick = function () {
      start(); // Restart the game when the button is clicked
    };

    start();
  };

  function start() {
    // Creating Chess object
    chess = new Chess(p, DEFAULT_FEN);
  }

  p.draw = () => {
    p.background(0);
    chess.render();
  };

  p.mousePressed = (event) => {
    let file = Math.floor((p.mouseX / p.width) * FILES_RANKS);
    let rank = Math.floor((p.mouseY / p.width) * FILES_RANKS);

    if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
      chess.pick(file, rank);

      dragOffsetX = file * TILE_DIMENSION - p.mouseX;
      dragOffsetY = rank * TILE_DIMENSION - p.mouseY;

      chess.drag(p.mouseX, p.mouseY, dragOffsetX, dragOffsetY);
    }
  };

  p.mouseDragged = (event) => {
    chess.drag(p.mouseX, p.mouseY, dragOffsetX, dragOffsetY);
  };

  p.mouseReleased = (event) => {
    let file = Math.floor((p.mouseX / p.width) * FILES_RANKS);
    let rank = Math.floor((p.mouseY / p.width) * FILES_RANKS);
    chess.release(file, rank);
  };

  // p.windowResized(event) => {
  //   let newDimension = 0;

  //   let MIN_DIM = 800;
  // if (window.innerWidth > MIN_DIM)
  //   newDimension = window.innerWidth * 0.6;
  // else newDimension = MIN_DIM / 2;

  // TILE_DIMENSION = newDimension / FILES_RANKS;
  // resizeCanvas(BOARD_DIMENSION, BOARD_DIMENSION); // Resize canvas
  // }
};

// Starting P5 Sketch
new p5(sketch, document.getElementById("chess"));
