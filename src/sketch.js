let chess; // Variable to hold the Chess game instance

// Control Panel
let fenInput, fenString; // Input field and variable for FEN string

// Picking variables
let selectedPiece; // Currently selected piece
let selectedPieceMoves; // Possible moves for the selected piece
let pickFile, pickRank; // File and rank where mouse was pressed initially
let dragFile, dragRank; // File and rank where mouse is dragged
let dragX, dragY; // Current mouse position
let offsetX, offsetY; // Offset between mouse position and piece position

function setup() {
  // Canvas
  let canvas = createCanvas(BOARD_DIMENSION, BOARD_DIMENSION);
  canvas.parent("chess"); // Attach canvas to HTML element with id "chess"

  // Control Panel
  fenInput = document.getElementById("fen-string-input"); // Get FEN input element
  fenInput.value = DEFAULT_FEN; // Set default FEN value
  fenInput.onchange = function () {
    fenString = fenInput.value; // Update fenString when input changes
    start(); // Restart the game with the new FEN string
  };
  fenString = fenInput.value; // Initialize fenString with default value

  fenButton = document.getElementById("restart-button"); // Get restart button element
  fenButton.onclick = function () {
    start(); // Restart the game when the button is clicked
  };

  // Starting the game
  start();
}

function start() {
  // Initialize chess game with the provided FEN string
  chess = new Chess();
  chess.initialize(fenString);
}

function draw() {
  background(0); // Clear the canvas

  chess.render(); // Render the chessboard and pieces

  // Render overlay for selected piece's possible moves
  if (selectedPiece != null) {
    selectedPieceMoves.forEach((move) => {
      // Draw overlay for each possible move
      fill(OVERLAY_COLOR); // Set overlay color
      rect(
        move.moveFile * CELL_DIMENSION,
        move.moveRank * CELL_DIMENSION,
        CELL_DIMENSION,
        CELL_DIMENSION
      ); // Draw overlay rectangle
    });

    // Draw overlay for possible moves cell
    selectedPiece.drawFree(dragX + offsetX, dragY + offsetY);
  }
}

function mousePressed() {
  // Get file and rank where mouse was pressed
  pickFile = Math.floor((mouseX / BOARD_DIMENSION) * FILES_RANKS);
  pickRank = Math.floor((mouseY / BOARD_DIMENSION) * FILES_RANKS);

  offsetX = pickFile * CELL_DIMENSION - mouseX; // Calculate X offset
  offsetY = pickRank * CELL_DIMENSION - mouseY; // Calculate Y offset

  dragX = mouseX; // Set drag X position
  dragY = mouseY; // Set drag Y position

  dragFile = pickFile; // Set drag file
  dragRank = pickRank; // Set drag rank

  selectedPiece = chess.getPiece(pickFile, pickRank); // Get selected piece

  if (selectedPiece.color !== chess.turn) selectedPiece = null;

  if (selectedPiece != null) {
    // Hide the selected piece temporarily
    chess.setPiece(pickFile, pickRank, null);

    // Calculate possible moves for the selected piece
    selectedPieceMoves = selectedPiece.calculatePossibleMoves(
      chess,
      pickFile,
      pickRank
    );
  }
}

function mouseDragged() {
  dragX = mouseX; // Update drag X position
  dragY = mouseY; // Update drag Y position

  dragFile = Math.floor((mouseX / BOARD_DIMENSION) * FILES_RANKS); // Update drag file
  dragRank = Math.floor((mouseY / BOARD_DIMENSION) * FILES_RANKS); // Update drag rank
}

function mouseReleased() {
  if (selectedPiece != null) {
    let releaseFile = floor((mouseX / BOARD_DIMENSION) * FILES_RANKS); // Get release file
    let releaseRank = floor((mouseY / BOARD_DIMENSION) * FILES_RANKS); // Get release rank

    // Check if the selected piece can be moved to the desired position
    let canMove = false;
    selectedPieceMoves.forEach(({ moveFile, moveRank }) => {
      if (moveFile == releaseFile && moveRank == releaseRank) canMove = true;
    });

    if (canMove) {
      // If the piece can be moved
      if (!chess.isEmpty(releaseFile, releaseRank)) {
        // If there's a piece to be eaten
        // Implement the logic for piece eating here
      }
      chess.setPiece(releaseFile, releaseRank, selectedPiece); // Set the piece to the release position
      selectedPiece.hasBeenMoved(); // Mark the piece as moved
    } else {
      chess.setPiece(pickFile, pickRank, selectedPiece); // Set the piece back to its original position
    }

    selectedPiece = null; // Reset selected piece
  }
}

function windowResized() {
  let MIN_DIM = 800;
  if (window.innerWidth > MIN_DIM)
    BOARD_DIMENSION = window.innerWidth * dimMultiplier;
  else BOARD_DIMENSION = MIN_DIM / 2;

  CELL_DIMENSION = BOARD_DIMENSION / FILES_RANKS;
  resizeCanvas(BOARD_DIMENSION, BOARD_DIMENSION); // Resize canvas
}
