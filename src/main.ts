import * as p5 from "p5";
import Chess from "./chess";
import {
  BOARD_DIMENSION,
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

  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    // Creating Chess objectù
    chess = new Chess(p, DEFAULT_FEN);
  };

  p.draw = () => {
    p.background(0);
    chess.render();
  };

  p.mousePressed = (event) => {
    let file = Math.floor((p.mouseX / BOARD_DIMENSION) * FILES_RANKS);
    let rank = Math.floor((p.mouseY / BOARD_DIMENSION) * FILES_RANKS);

    chess.pick(file, rank);

    dragOffsetX = file * TILE_DIMENSION - p.mouseX;
    dragOffsetY = rank * TILE_DIMENSION - p.mouseY;

    chess.drag(p.mouseX, p.mouseY, dragOffsetX, dragOffsetY);
  };

  p.mouseDragged = (event) => {
    chess.drag(p.mouseX, p.mouseY, dragOffsetX, dragOffsetY);
  };

  p.mouseReleased = (event) => {
    let file = Math.floor((p.mouseX / BOARD_DIMENSION) * FILES_RANKS);
    let rank = Math.floor((p.mouseY / BOARD_DIMENSION) * FILES_RANKS);
    chess.release(file, rank);
  };
};

// Starting P5 Sketch
new p5(sketch, document.body);
