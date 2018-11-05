class Piece {
    constructor(pieceType, black) {
        this.selected = false;
        this.black = black;
        this.movesMade = 0;
        this.pieceType = pieceType;
        this.unpopped = true;
        for (let i = 0; i < 6; i++) {
            if (pieceType == pieceJSON[i].name) {
                let current = pieceJSON[i];


                if (pieceType == "Pawn" && !black) {
                    this.moveset = [
                        [0, -1],
                        [0, -2]
                    ];
                    this.hits = [
                        [1, -1],
                        [-1, -1]
                    ]
                } else {

                    this.moveset = current.moveset;
                }
                if (current.hits == "moveset") {
                    this.hits = current.moveset;
                } else {
                    this.hits = current.hits;
                }

                if (black) {
                    this.sprite = mainSprite.get(current.sprite, 1);
                } else {
                    this.sprite = mainSprite.get(current.sprite, 0);
                }
                break;
            }
        }
    }


    draw() {
        if (this.movesMade > 0 && this.unpopped && this.pieceType == "Pawn") {
            this.moveset.pop();
            this.unpopped = false;
        }
        if (this.selected) {
            noStroke();
            fill(76, 153, 0);
            rect(0, 0, SIZE, SIZE);
        }
        image(this.sprite, 0, 0);
    }
}
