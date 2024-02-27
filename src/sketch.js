let chess;

// Control Panel
let fenInput, fenString;

// Picking variables
let selectedPiece;
let selectedPieceMoves;
let pickFile, pickRank;
let dragFile, dragRank;
let dragX, dragY;
let offsetX, offsetY;

function setup() {
  // Canvas
  let canvas = createCanvas(BOARD_DIMENSION, BOARD_DIMENSION);
  canvas.parent("chess");

  // Control Panel

  fenInput = document.getElementById("fen-string-input");
  fenInput.value = DEFAULT_FEN;
  fenInput.onchange = function () {
    fenString = fenInput.value;
    start();
  };
  fenString = fenInput.value;

  fenButton = document.getElementById("restart-button");
  fenButton.onclick = function () {
    start();
  };

  // Starting the game
  start();
}

function start() {
  // Chess
  chess = new Chess();
  chess.initialize(fenString);
}

function draw() {
  background(0);

  // TODO: fix
  // if (fenString != fenInput.value()) {
  //   fenString = fenInput.value();
  //   chess.initialize(fenString);
  // }

  chess.update();
  chess.render();

  // Rendering current selected piece
  if (selectedPiece != null) {
    selectedPieceMoves.forEach((move) => {
      // Drawing current cell overlay
      fill(OVERLAY_COLOR);

      rect(
        move.moveFile * CELL_DIMENSION,
        move.moveRank * CELL_DIMENSION,
        CELL_DIMENSION,
        CELL_DIMENSION
      );
    });

    // Drawing possible moves cell overlay

    selectedPiece.drawFree(dragX + offsetX, dragY + offsetY);
  }
}

function mousePressed() {
  pickFile = Math.floor((mouseX / BOARD_DIMENSION) * FILES_RANKS);
  pickRank = Math.floor((mouseY / BOARD_DIMENSION) * FILES_RANKS);

  offsetX = pickFile * CELL_DIMENSION - mouseX;
  offsetY = pickRank * CELL_DIMENSION - mouseY;

  dragX = mouseX;
  dragY = mouseY;

  dragFile = pickFile;
  dragRank = pickRank;

  selectedPiece = chess.getPiece(pickFile, pickRank);

  if (selectedPiece != null) {
    // "Hiding" the piece
    chess.setPiece(pickFile, pickRank, null);

    // Calculating possible moves
    selectedPieceMoves = selectedPiece.calculatePossibleMoves(
      chess,
      pickFile,
      pickRank
    );
  }
}

function mouseDragged() {
  dragX = mouseX;
  dragY = mouseY;

  dragFile = Math.floor((mouseX / BOARD_DIMENSION) * FILES_RANKS);
  dragRank = Math.floor((mouseY / BOARD_DIMENSION) * FILES_RANKS);
}

function mouseReleased() {
  if (selectedPiece != null) {
    let releaseFile = floor((mouseX / BOARD_DIMENSION) * FILES_RANKS);
    let releaseRank = floor((mouseY / BOARD_DIMENSION) * FILES_RANKS);

    // Checking if piece can be moved to desired position

    let canMove = false;
    selectedPieceMoves.forEach(({ moveFile, moveRank }) => {
      if (moveFile == releaseFile && moveRank == releaseRank) canMove = true;
    });

    if (canMove) {
      // Piece can be moved
      if (!chess.isEmpty(releaseFile, releaseRank)) {
        // Piece has to eat
      }
      chess.setPiece(releaseFile, releaseRank, selectedPiece);
      selectedPiece.hasBeenMoved();
    } else {
      chess.setPiece(pickFile, pickRank, selectedPiece);
    }

    selectedPiece = null;
  }
}

function windowResized() {
  let MIN_DIM = 800;
  if (window.innerWidth > MIN_DIM)
    BOARD_DIMENSION = window.innerWidth * dimMultiplier;
  else BOARD_DIMENSION = MIN_DIM / 2;

  CELL_DIMENSION = BOARD_DIMENSION / FILES_RANKS;
  resizeCanvas(BOARD_DIMENSION, BOARD_DIMENSION);
}
