const SIZE = 90;
let board;
let history;
let pieceJSON;
let sprite;
let mainSprite;
let algo;

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
    algo = new Algorithm();
}

function draw() {
    background(51);

    board.draw();

    if (!board.currentlyWhite) {
        algo.move();
        console.log("Generating ai moves: " + algo.tree.bestMove + " " + algo.tree.bestMove.length);
        loadBoard(algo.tree.bestMove.data);
    }


}


function mousePressed() {
    if (playerTurn) {
        board.selectPiece(mouseX, mouseY);
        playerTurn = !board.moved;
    }
}

function loadBoard(newBoard) {
    history = board;
    board = newBoard;
}

function resetBoard() {
    board = history;
    history = undefined;
}
