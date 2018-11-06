const SIZE = 90;
let board;
let pieceJSON;
let sprite;
let mainSprite;

let playerTurn = true;

function preload() {
    pieceJSON = loadJSON("pieces.json");
    sprite = loadImage("Chess_Pieces_Sprite.png");
}

function setup() {
    createCanvas(8 * SIZE, 8 * SIZE);
    mainSprite = new Sprite();
    mainSprite.resize(SIZE);
    board = new Board(false);
}

function draw() {
    background(51);

    board.draw();


}


function mousePressed() {
    if (playerTurn) {
        board.selectPiece(mouseX, mouseY);
        playerTurn = !board.moved;
    }
}
