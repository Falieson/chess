const SIZE = 90;
let board;
let history;
let pieceJSON;
let sprite;
let mainSprite;

let playerTurn = true;

function preload() {
    pieceJSON = loadJSON("pieces.json");
    sprite = loadImage("Chess_Pieces_Sprite.png");
}

function setup() {
    console.log("Setup");
    createCanvas(8 * SIZE, 8 * SIZE);
    mainSprite = new Sprite();
    mainSprite.resize(SIZE);
    board = new Board(false);
}

function draw() {
    background(51);

    board.draw();

    if (!board.currentlyWhite && !Algorithm.minmax.alphaBetaAsyncIsRunning) {
        Algorithm.minmax.alphaBetaAsync(board, 2, -Infinity, Infinity, true).then(() => {
            console.log(Algorithm.minmax.alphaBetaResult());

            Algorithm.minmax.alphaBetaAsyncIsRunning = false;
            loadBoard(Algorithm.minmax.alphaBetaResult().data);
        });
    }

}

function mousePressed() {
    if (playerTurn) {
        board.selectPiece(mouseX, mouseY);
        playerTurn = !board.moved;
    }
}

function loadBoard(newBoard) {
    history = new Board(false, board);
    board = newBoard;
}

function resetBoard() {
    board = history;
    history = undefined;
    debugger;
}
