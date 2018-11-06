class Board {
    constructor(userPlaysBlack) {

        this.user = userPlaysBlack;
        this.currentlyWhite = true;

        this.pieces = new Array(8).fill(0).map(x => Array(8));
        //Back Row
        this.pieces[0][0] = new Piece("Rook", true);
        this.pieces[1][0] = new Piece("Knight", true);
        this.pieces[2][0] = new Piece("Bishop", true);
        this.pieces[3][0] = new Piece("Queen", true);
        this.pieces[4][0] = new Piece("King", true);
        this.pieces[5][0] = new Piece("Bishop", true);
        this.pieces[6][0] = new Piece("Knight", true);
        this.pieces[7][0] = new Piece("Rook", true);

        //Black Pawn Row
        for (let i = 0; i < 8; i++) {
            this.pieces[i][1] = new Piece("Pawn", true);
        }

        //White Pawn Row
        for (let i = 0; i < 8; i++) {
            this.pieces[i][6] = new Piece("Pawn", false);
        }

        this.pieces[0][7] = new Piece("Rook", false);
        this.pieces[1][7] = new Piece("Knight", false);
        this.pieces[2][7] = new Piece("Bishop", false);
        this.pieces[3][7] = new Piece("Queen", false);
        this.pieces[4][7] = new Piece("King", false);
        this.pieces[5][7] = new Piece("Bishop", false);
        this.pieces[6][7] = new Piece("Knight", false);
        this.pieces[7][7] = new Piece("Rook", false);
    }

    draw() {
        fill(255);
        noStroke();

        for (let i = 0; i < 8; i++) {
            for (let n = 0; n < 8; n++) {
                if (i % 2 == 0 && n % 2 == 1 || i % 2 == 1 && n % 2 == 0) {
                    rect(i * SIZE, n * SIZE, SIZE, SIZE)
                }
            }
        }
        if (this.lastSelected) {
            this.possibleMoves = [];
            translate(this.lastSelectedLocation[0] * SIZE, this.lastSelectedLocation[1] * SIZE);
            noStroke();
            fill(153, 20, 20);
            for (let r of this.lastSelected.moveset) {
                if (r[0] != 8 && r[1] != 8) {
                    if (this.lastSelected.pieceType == "Pawn" && this.pieces[this.lastSelectedLocation[0] + r[0]][this.lastSelectedLocation[1] + r[1]] != undefined) {
                        console.log(this.pieces[this.lastSelectedLocation[0] + r[0]][this.lastSelectedLocation[1] + r[1]]);
                        //debugger;
                        break;
                    }

		    if(this.lastSelectedLocation[0] + r[0] < 0 || this.lastSelectedLocation[0] + r[0] > 7 || this.lastSelectedLocation[1] + r[1] < 0 || this.lastSelectedLocation[1] + r[1]> 7){
			continue;
		    }
		    if(this.pieces[this.lastSelectedLocation[0] + r[0]][this.lastSelectedLocation[1] + r[1]] && this.lastSelected.black == this.pieces[this.lastSelectedLocation[0] + r[0]][this.lastSelectedLocation[1] + r[1]].black){
			continue;
		    }
                    this.possibleMoves.push([this.lastSelectedLocation[0] + r[0], this.lastSelectedLocation[1] + r[1]]);
                    rect(r[0] * SIZE, r[1] * SIZE, SIZE, SIZE);
                }


                if ((r[0] == 8 && r[1] == 8) || (r[0] == 8 && r[1] == -8) || (r[0] == -8 && r[1] == 8) || (r[0] == -8 && r[1] == -8) || (r[0] == 0 && (r[1] == 8 || r[1] == -8)) || (r[1] == 0 && (r[0] == 8 || r[0] == -8))) {
                    for (let i = 1; i < 8; i++) {
                        let breaking = false;
                        if (this.lastSelectedLocation[0] + floor(r[0] / 8) * i > 7 || this.lastSelectedLocation[0] + floor(r[0] / 8) * i < 0) {
                            break;
                        }
                        if (this.lastSelectedLocation[1] + floor(r[1] / 8) * i > 7 || this.lastSelectedLocation[1] + floor(r[1] / 8) * i < 0) {
                            break;
                        }
                        if (this.pieces[this.lastSelectedLocation[0] + floor(r[0] / 8) * i][this.lastSelectedLocation[1] + floor(r[1] / 8) * i] != undefined) { // && this.canHit(this.lastSelectedLocation[0], this.lastSelectedLocation[1], this.lastSelectedLocation[0] + floor(r[0] / 8) * i, this.lastSelectedLocation[1] + floor(r[1] / 8) * i)) {
                            if (this.lastSelected.black == this.pieces[this.lastSelectedLocation[0] + floor(r[0] / 8) * i][this.lastSelectedLocation[1] + floor(r[1] / 8) * i].black) {
                                break;
                            }
                            breaking = true;
                        }
                        this.possibleMoves.push([this.lastSelectedLocation[0] + (r[0] / 8) * i, this.lastSelectedLocation[1] + (r[1] / 8) * i])
                        rect((r[0] / 8) * i * SIZE, (r[1] / 8) * i * SIZE, SIZE, SIZE);
                        if (breaking) {
                            break;
                        }
                    }
                }
                

            if (this.lastSelectedLocation[1] + 1 < 8 && this.lastSelectedLocation[0] - 1 >= 0 && this.lastSelected.pieceType == "Pawn" && this.lastSelected.black && this.pieces[this.lastSelectedLocation[0] - 1][this.lastSelectedLocation[1] + 1] != undefined) {
		if(this.lastSelected.black == this.pieces[this.lastSelectedLocation[0] - 1][this.lastSelectedLocation[1] + 1].black){
                	this.possibleMoves.push([this.lastSelectedLocation[0] - 1, this.lastSelectedLocation[1] + 1]);
                	rect((-1) * SIZE, (1) * SIZE, SIZE, SIZE);		    
		}
            }
            if (this.lastSelectedLocation[1] + 1 < 8 && (this.lastSelectedLocation[0] + 1) < 8 && this.lastSelected.pieceType == "Pawn" && this.lastSelected.black && this.pieces[this.lastSelectedLocation[0] + 1][this.lastSelectedLocation[1] + 1] != undefined) {
		if(this.lastSelected.black ==  this.pieces[this.lastSelectedLocation[0] + 1][this.lastSelectedLocation[1] + 1].black){
                	this.possibleMoves.push([this.lastSelectedLocation[0] + 1, this.lastSelectedLocation[1] + 1]);
                	rect((1) * SIZE, (1) * SIZE, SIZE, SIZE);
		}
            }
            if (this.lastSelectedLocation[1] - 1 >= 0 && this.lastSelectedLocation[0] - 1 >= 0 && this.lastSelected.pieceType == "Pawn" && !this.lastSelected.black && this.pieces[this.lastSelectedLocation[0] - 1][this.lastSelectedLocation[1] - 1] != undefined) {
		if(this.lastSelected.black == this.pieces[this.lastSelectedLocation[0] - 1][this.lastSelectedLocation[1] - 1].black){
                	this.possibleMoves.push([this.lastSelectedLocation[0] - 1, this.lastSelectedLocation[1] - 1]);
                	rect((-1) * SIZE, (-1) * SIZE, SIZE, SIZE);
		}
            }
            if (this.lastSelectedLocation[1] - 1 >= 0 && (this.lastSelectedLocation[0] + 1) < 8 && this.lastSelected.pieceType == "Pawn" && !this.lastSelected.black && this.pieces[this.lastSelectedLocation[0] + 1][this.lastSelectedLocation[1] - 1] != undefined) {
		if(this.lastSelected.black == this.pieces[this.lastSelectedLocation[0] + 1][this.lastSelectedLocation[1] - 1].black){
                	this.possibleMoves.push([this.lastSelectedLocation[0] + 1, this.lastSelectedLocation[1] - 1]);
                	rect((1) * SIZE, (-1) * SIZE, SIZE, SIZE);
		}
            }

            translate(-this.lastSelectedLocation[0] * SIZE, -this.lastSelectedLocation[1] * SIZE);
        }
        for (let i = 0; i < this.pieces.length; i++) {
            for (let n = 0; n < this.pieces[0].length; n++) {
                if (this.pieces[i][n] != undefined) {
                    //console.log("x = " + i + " y = " + n);
                    translate(i * SIZE, n * SIZE);
                    this.pieces[i][n].draw();
                    translate(-i * SIZE, -n * SIZE);
                }
            }
        }
    }

    possibleMove(x, y) {
        for (let b of this.possibleMoves) {
            if (b[0] == x && b[1] == y) {
                return true;
            }
        }
        return false;
    }

    canHit(x, y, tx, ty) {
        if (this.pieces[tx][ty] == undefined) {
            return;
        }
        //if (this.pieces[tx][ty].black = this.pieces[x][y].black) {
        //return;
        //}
        for (let b of this.pieces[x][y].hits) {
            if (b[0] == tx && b[1] == ty) {
                return true;
            }
        }
        return false;
    }

    move(x, y, tx, ty) {

        if (this.currentlyWhite == this.pieces[x][y].black) {
            return;
        }
        this.currentlyWhite = !this.currentlyWhite;


        this.pieces[x][y].movesMade++;
        this.pieces[tx][ty] = this.pieces[x][y];
        this.pieces[x][y] = undefined;
    }

    selectPiece(x, y) {
        let gridX = floor(x / SIZE);
        let gridY = floor(y / SIZE);

        if (gridX < 0 && gridX > 7 && gridY < 0 && gridX > 7) {
            return;
        }

        console.log(gridX + " " + gridY);

        if (this.pieces[gridX][gridY] && !this.lastSelected && this.pieces[gridX][gridY].black != this.currentlyWhite) { // && this.pieces[gridX][gridY].black == this.user
            this.pieces[gridX][gridY].selected = true;
            this.lastSelected = this.pieces[gridX][gridY];
            this.lastSelectedLocation = [gridX, gridY];
        } else if (this.lastSelected && this.possibleMoves && this.possibleMove(gridX, gridY)) {
            this.move(this.lastSelectedLocation[0], this.lastSelectedLocation[1], gridX, gridY);
            this.lastSelected.selected = false;
            this.lastSelected = undefined;
            console.log("moved");
        } else if (this.lastSelected) {
            this.lastSelected.selected = false;
            this.lastSelected = undefined;
        }
        //console.log(this.possibleMove(gridX, gridY));
        //console.log(gridX + " " + gridY + "  " + this.possibleMoves[0][0] + " " + this.possibleMoves[0][1]);
    }
}
