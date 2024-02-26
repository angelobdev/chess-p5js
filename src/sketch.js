let chess;

// Control Panel
let fenInput, fenString;

// Picking variables
let selectedPiece;
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
  background(255, 0, 255);

  // TODO: fix
  // if (fenString != fenInput.value()) {
  //   fenString = fenInput.value();
  //   chess.initialize(fenString);
  // }

  chess.update();
  chess.render();

  // Rendering current selected piece
  if (selectedPiece != null) {
    // Drawing current cell overlay
    fill(
      chess.getPiece(dragFile, dragRank) == null ? "#00ff0050" : "#ff000050"
    );

    rect(
      dragFile * CELL_DIMENSION,
      dragRank * CELL_DIMENSION,
      CELL_DIMENSION,
      CELL_DIMENSION
    );

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
    chess.setPiece(pickFile, pickRank, null); // "Hiding" the piece
    console.log("Selezionato");
  }
}

function mouseDragged() {
  dragX = mouseX;
  dragY = mouseY;

  dragFile = Math.floor((mouseX / BOARD_DIMENSION) * FILES_RANKS);
  dragRank = Math.floor((mouseY / BOARD_DIMENSION) * FILES_RANKS);

  console.log("Sposto");
}

function mouseReleased() {
  if (selectedPiece != null) {
    let releaseFile = floor((mouseX / BOARD_DIMENSION) * FILES_RANKS);
    let releaseRank = floor((mouseY / BOARD_DIMENSION) * FILES_RANKS);

    if (chess.isEmpty(releaseFile, releaseRank))
      chess.setPiece(releaseFile, releaseRank, selectedPiece);
    else chess.setPiece(pickFile, pickRank, selectedPiece);

    selectedPiece = null;
  }
}
