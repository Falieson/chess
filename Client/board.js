class Board {
    constructor(userPlaysBlack, currentBoard) {

        //Constructor overloading :/
        if (currentBoard instanceof Board) {
            let c = currentBoard; //Just for convinience
            this.user = userPlaysBlack;
            this.currentlyWhite = c.currentlyWhite;

            this.chW = c.chW;
            this.chB = c.chB;
            this.cmW = c.cmW;
            this.cmB = c.cmB;

            this.kingWhite = c.kingWhite.slice();
            this.kingBlack = c.kingBlack.slice();

            this.moves = c.moves;

            this.original = false;

            this.pieces = c.pieces.map(function(arr) {
                return arr.slice();
            });
            return;
        }

        this.moves = 0;

        this.original = true;

        this.user = userPlaysBlack;
        this.currentlyWhite = true;

        this.chW = false;
        this.chB = false;
        this.cmW = false;
        this.cmB = false;

        this.checkMoves = {};

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

        this.kingWhite = this.getKing(true);
        this.kingBlack = this.getKing(false);
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
            fill(153, 20, 20, 200);

            this.getPossibleMoves(this.lastSelectedLocation[0], this.lastSelectedLocation[1], true, false);

            translate(-this.lastSelectedLocation[0] * SIZE, -this.lastSelectedLocation[1] * SIZE);

        }
        for (let i = 0; i < this.pieces.length; i++) {
            for (let n = 0; n < this.pieces[0].length; n++) {
                if (this.pieces[i][n] != undefined) {
                    ////console.log("x = " + i + " y = " + n);
                    translate(i * SIZE, n * SIZE);
                    this.pieces[i][n].draw();
                    translate(-i * SIZE, -n * SIZE);
                }
            }
        }
    }

    getPossibleMoves(x, y, draw, ret, testm8) {

        let result = [];

        if (!testm8) {
            if (this.chW || this.chB) {
                if (this.includesObj(this.checkMoves, x, y)) {
                    ////console.log(this.checkMoves);
                    if (draw) {
                        for (let r of this.checkMoves[x + "," + y]) {
                            ////console.log("Drawing " + r[0] + " " + r[1]);
                            translate(-this.lastSelectedLocation[0] * SIZE, -this.lastSelectedLocation[1] * SIZE);
                            rect(r[0] * SIZE, r[1] * SIZE, SIZE, SIZE);
                            translate(this.lastSelectedLocation[0] * SIZE, this.lastSelectedLocation[1] * SIZE);
                        }
                    }
                    if (ret) {
                        return this.checkMoves[x + "," + y];
                    } else {
                        this.possibleMoves = this.checkMoves[x + "," + y];
                        return;
                    }
                } else {
                    if (ret) {
                        return result;
                    } else {
                        this.possibleMoves = [];
                        return;
                    }
                }
            }
        }

        if (this.pieces[x][y].pieceType == "King") {
            if (this.castling(false, x, y, 0, y)) {
                rect(-3 * SIZE, 0, SIZE, SIZE);
            }
            if (this.castling(false, x, y, 7, y)) {
                rect(2 * SIZE, 0, SIZE, SIZE);
            }
        }

        for (let r of this.pieces[x][y].moveset) {
            if (r[0] != 8 && r[1] != 8 && r[0] != -8 && r[1] != -8) {
                if (this.pieces[x][y].pieceType == "Pawn" && this.pieces[x + r[0]][y + r[1]] != undefined) {
                    ////console.log(this.pieces[x + r[0]][y + r[1]]);
                    //debugger;
                    break;
                }

                if (x + r[0] < 0 || x + r[0] > 7 || y + r[1] < 0 || y + r[1] > 7) {
                    continue;
                }
                if (this.pieces[x + r[0]][y + r[1]] && this.pieces[x][y].black == this.pieces[x + r[0]][y + r[1]].black) {
                    continue;
                }
                result.push([x + r[0], y + r[1]]);
                if (draw) {
                    rect(r[0] * SIZE, r[1] * SIZE, SIZE, SIZE);
                }
            }


            if ((r[0] == 8 && r[1] == 8) || (r[0] == 8 && r[1] == -8) || (r[0] == -8 && r[1] == 8) || (r[0] == -8 && r[1] == -8) || (r[0] == 0 && (r[1] == 8 || r[1] == -8)) || (r[1] == 0 && (r[0] == 8 || r[0] == -8))) {
                for (let i = 1; i < 8; i++) {
                    let breaking = false;
                    let tx = x + ((r[0] / 8) * i);
                    let ty = y + ((r[1] / 8) * i);
                    // if (r[1] / 8 < 0) {
                    //     debugger;
                    // }

                    if (tx > 7 || ty > 7) {
                        ////console.log("Too big for u");
                        //debugger;
                        break;
                    } else {
                        //debugger;
                    }


                    if (tx < 0 || ty < 0) {
                        //debugger;
                        ////console.log("Too small for u");
                        break;
                    }
                    if (this.pieces[tx][ty] != undefined) { // && this.canHit(this.lastSelectedLocation[0], this.lastSelectedLocation[1], this.lastSelectedLocation[0] + floor(r[0] / 8) * i, this.lastSelectedLocation[1] + floor(r[1] / 8) * i)) {
                        if (this.pieces[x][y].black == this.pieces[tx][ty].black) {
                            break;
                        }
                        breaking = true;
                    }
                    result.push([tx, ty])
                    if (draw) {
                        rect((r[0] / 8) * i * SIZE, (r[1] / 8) * i * SIZE, SIZE, SIZE);
                    }
                    if (breaking) {
                        break;
                    }
                }
                //debugger;
            }


            if (y + 1 < 8 && x - 1 >= 0 && this.pieces[x][y].pieceType == "Pawn" && this.pieces[x][y].black && this.pieces[x - 1][y + 1] != undefined) {
                if (this.pieces[x][y].black != this.pieces[x - 1][y + 1].black) {
                    result.push([x - 1, y + 1]);
                    if (draw) {
                        rect((-1) * SIZE, (1) * SIZE, SIZE, SIZE);
                    }
                }
            }
            if (y + 1 < 8 && (x + 1) < 8 && this.pieces[x][y].pieceType == "Pawn" && this.pieces[x][y].black && this.pieces[x + 1][y + 1] != undefined) {
                if (this.pieces[x][y].black != this.pieces[x + 1][y + 1].black) {
                    result.push([x + 1, y + 1]);
                    if (draw) {
                        rect((1) * SIZE, (1) * SIZE, SIZE, SIZE);
                    }
                }
            }
            if (y - 1 >= 0 && x - 1 >= 0 && this.pieces[x][y].pieceType == "Pawn" && !this.pieces[x][y].black && this.pieces[x - 1][y - 1] != undefined) {
                if (this.pieces[x][y].black != this.pieces[x - 1][y - 1].black) {
                    result.push([x - 1, y - 1]);
                    if (draw) {
                        rect((-1) * SIZE, (-1) * SIZE, SIZE, SIZE);
                    }
                }
            }
            if (y - 1 >= 0 && (x + 1) < 8 && this.pieces[x][y].pieceType == "Pawn" && !this.pieces[x][y].black && this.pieces[x + 1][y - 1] != undefined) {
                if (this.pieces[x][y].black != this.pieces[x + 1][y - 1].black) {
                    result.push([x + 1, y - 1]);
                    if (draw) {
                        rect((1) * SIZE, (-1) * SIZE, SIZE, SIZE);
                    }
                }
            }
        }

        if (!this.original && (this.pieces[x][y].pieceType == "King" || this.pieces[x][y].pieceType == "Rook")) {
            //console.log("Check for castling");
            let castlingMoves = this.possCastling();
            for (let a of castlingMoves) {
                result.push(a);
            }
        }

        if (!ret) {
            this.possibleMoves = result;
        } else {
            return result;
        }
    }

    possCastling() {
        let y = this.currentlyWhite ? 7 : 0;
        let moves = [];

        if (this.castling(false, 4, y, 0, y)) {
            moves.push(["c", 4, y, 0, y]);
        }
        if (this.castling(false, 4, y, 7, y)) {
            moves.push(["c", 4, y, 7, y]);
        }

        return moves;
    }

    castling(move, kX, kY, rX, rY) {
        if (!move) { //only checking if possible
            if (this.pieces[kX][kY] && this.pieces[kX][kY].pieceType == "King" && this.pieces[kX][kY].movesMade == 0 && this.pieces[rX][rY] && this.pieces[rX][rY].pieceType == "Rook" && this.pieces[rX][rY].movesMade == 0) {
                for (let i = kX + (kX > rX ? -1 : 1); kX > rX ? i > rX : i < rX; i += kX > rX ? -1 : 1) {
                    //console.log(i + " " + kY);
                    if (this.pieces[i][kY] != undefined) {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        } else {
            if (this.castling(false, kX, kY, rX, rY)) {
                if (this.original) {
                    this.pieces[rX][rY].movesMade++;
                    this.pieces[kX][kY].movesMade++;
                }
                this.moves++;
                this.pieces[rX + (kX > rX ? 1 : -1)][rY] = this.pieces[kX][kY];
                this.pieces[kX][kY] = undefined;
                this.pieces[kX + (kX > rX ? -2 : 1)][kY] = this.pieces[rX][rY];
                this.pieces[rX][rY] = undefined;
            }
        }

    }

    includes2D(arr, x, y) {
        for (let b of arr) {
            if (b[0] == x && b[1] == y) {
                return true;
            }
        }
        return false;
    }

    includesObj(obj, x, y) {
        for (let key in obj) {
            key = key.split(",");
            if (key[0] == x && key[1] == y) {
                return true;
            }
        }
        return false;
    }

    canHit(x, y, tx, ty) {
        if (this.pieces[tx][ty] == undefined) {
            return true;
        }
        if (this.pieces[x][y] == undefined) {
            console.error("Something in canHit() went terribly wrong: " + x + " and " + y + " does not exist!");
            return false;
        }
        if (this.pieces[tx][ty].black == this.pieces[x][y].black) {
            return false;
        }
        let hits;
        if (this.isEqual(this.pieces[x][y].moveset, this.pieces[x][y].hits)) {
            hits = this.getPossibleMoves(x, y, false, true, true);
        } else {
            hits = this.pieces[x][y].hits;
        }
        for (let b of hits) {
            if (b[0] == tx && b[1] == ty) {
                return true;
            }
        }
        return false;
    }

    isEqual(array1, array2) {
        return (array1.join('-') == array2.join('-'));
    }

    move(x, y, tx, ty, dontCheckM8) {

        if (this.cmB || this.cmW) {
            throw ("Checkmate");
        }

        if (this.currentlyWhite == this.pieces[x][y].black) {
            return;
        }
        this.currentlyWhite = !this.currentlyWhite;

        this.chW = false;
        this.chB = false;


        if (this.original) {
            this.pieces[x][y].movesMade++;
        }

        if (this.pieces[x][y].pieceType == "King") {
            if (this.pieces[x][y].black) {
                this.kingBlack = [tx, ty];
            } else {
                this.kingWhite = [tx, ty];
            }
        }
        this.moves++;
        this.pieces[tx][ty] = this.pieces[x][y];
        this.pieces[x][y] = undefined;
        this.checkm8(!dontCheckM8);
    }

    getKing(white) {
        for (let i = 0; i < this.pieces.length; i++) {
            for (let n = 0; n < this.pieces[0].length; n++) {
                if (this.pieces[i][n] && this.pieces[i][n].pieceType === "King") {
                    if (white && !this.pieces[i][n].black) {
                        return [i, n];
                    } else if (!white && this.pieces[i][n].black) {
                        return [i, n];
                    }
                }
            }
        }
        throw ("No " + white ? "white" : "black" + " king found!!");
    }

    checkm8(testm8, ret) {
        let checkMoves = {};
        let bK = this.kingBlack;
        let wK = this.kingWhite;

        for (let i = 1; i < 8; i++) {
            //White
            //Horiz + vertikal
            if (wK[0] + i < 8 && this.pieces[wK[0] + i][wK[1]] != undefined) {
                if (this.canHit(wK[0] + i, wK[1], wK[0], wK[1])) {
                    //console.log("Check!");
                    this.chW = true;
                }
            }
            if (wK[0] - i >= 0 && this.pieces[wK[0] - i][wK[1]] != undefined) {
                if (this.canHit(wK[0] - i, wK[1], wK[0], wK[1])) {
                    //console.log("Check!");
                    this.chW = true;
                }
            }
            if (wK[1] + i < 8 && this.pieces[wK[0]][wK[1] + i] != undefined) {
                if (this.canHit(wK[0], wK[1] + i, wK[0], wK[1])) {
                    //console.log("Check!");
                    this.chW = true;
                }
            }
            if (wK[1] - i >= 0 && this.pieces[wK[0]][wK[1] - i] != undefined) {
                if (this.canHit(wK[0], wK[1] - i, wK[0], wK[1])) {
                    //console.log("Check!");
                    this.chW = true;
                }
            }
            //Diagonal
            if (wK[0] + i < 8 && wK[1] + i < 8 && this.pieces[wK[0] + i][wK[1] + i] != undefined) {
                if (this.canHit(wK[0] + i, wK[1] + i, wK[0], wK[1])) {
                    //console.log("Check!");
                    this.chW = true;
                }
            }
            if (wK[0] + i < 8 && wK[1] - i >= 0 && this.pieces[wK[0] + i][wK[1] - i] != undefined) {
                if (this.canHit(wK[0] + i, wK[1] - i, wK[0], wK[1])) {
                    //console.log("Check!");
                    this.chW = true;
                }
            }
            if (wK[0] - i >= 0 && wK[1] + i < 8 && this.pieces[wK[0] - i][wK[1] + i] != undefined) {
                if (this.canHit(wK[0] - i, wK[1] + i, wK[0], wK[1])) {
                    //console.log("Check!");
                    this.chW = true;
                }
            }
            if (wK[0] - i >= 0 && wK[1] - i >= 0 && this.pieces[wK[0] - i][wK[1] - i] != undefined) {
                if (this.canHit(wK[0] - i, wK[1] - i, wK[0], wK[1])) {
                    //console.log("Check!");
                    this.chW = true;
                }
            }


            //Black
            //Horiz + vertikal
            if (bK[0] + i < 8 && this.pieces[bK[0] + i][bK[1]] != undefined) {
                if (this.canHit(bK[0] + i, bK[1], bK[0], bK[1])) {
                    //console.log("Check!");
                    this.chB = true;
                }
            }
            if (bK[0] - i >= 0 && this.pieces[bK[0] - i][bK[1]] != undefined) {
                if (this.canHit(bK[0] - i, bK[1], bK[0], bK[1])) {
                    //console.log("Check!");
                    this.chB = true;
                }
            }
            if (bK[1] + i < 8 && this.pieces[bK[0]][bK[1] + i] != undefined) {
                if (this.canHit(bK[0], bK[1] + i, bK[0], bK[1])) {
                    //console.log("Check!");
                    this.chB = true;
                }
            }
            if (bK[1] - i >= 0 && this.pieces[bK[0]][bK[1] - i] != undefined) {
                if (this.canHit(bK[0], bK[1] - i, bK[0], bK[1])) {
                    //console.log("Check!");
                    this.chB = true;
                }
            }
            //Diagonal
            if (bK[0] + i < 8 && bK[1] + i < 8 && this.pieces[bK[0] + i][bK[1] + i] != undefined) {
                if (this.canHit(bK[0] + i, bK[1] + i, bK[0], bK[1])) {
                    //console.log("Check!");
                    this.chB = true;
                }
            }
            if (bK[0] + i < 8 && bK[1] - i >= 0 && this.pieces[bK[0] + i][bK[1] - i] != undefined) {
                if (this.canHit(bK[0] + i, bK[1] - i, bK[0], bK[1])) {
                    //console.log("Check!");
                    this.chB = true;
                }
            }
            if (bK[0] - i >= 0 && bK[1] + i < 8 && this.pieces[bK[0] - i][bK[1] + i] != undefined) {
                if (this.canHit(bK[0] - i, bK[1] + i, bK[0], bK[1])) {
                    //console.log("Check!");
                    this.chB = true;
                }
            }
            if (bK[0] - i >= 0 && bK[1] - i >= 0 && this.pieces[bK[0] - i][bK[1] - i] != undefined) {
                if (this.canHit(bK[0] - i, bK[1] - i, bK[0], bK[1])) {
                    //console.log("Check!");
                    this.chB = true;
                }
            }
        }


        if (!testm8) {
            return;
        }

        //Actual checkmate test
        if (this.chW && this.currentlyWhite) {
            let m8 = true;
            for (let i = 0; i < this.pieces.length; i++) {
                for (let n = 0; n < this.pieces[0].length; n++) {
                    if (!this.pieces[i][n] || this.pieces[i][n].black) {
                        continue;
                    }
                    let tmpCopy = new Board(this.user, this);
                    for (let a of tmpCopy.getPossibleMoves(i, n, false, true, true)) {
                        ////console.log("New move");

                        tmpCopy.currentlyWhite = true;
                        tmpCopy.chW = false;

                        if (tmpCopy.canHit(i, n, a[0], a[1])) {
                            tmpCopy.move(i, n, a[0], a[1], true);
                        } else {
                            continue;
                        }
                        if (!tmpCopy.chW) {
                            //console.log("Not m8");
                            m8 = false;
                            if (!checkMoves[i + "," + n]) {
                                checkMoves[i + "," + n] = [];
                            }
                            checkMoves[i + "," + n].push([a[0], a[1]]);
                        }
                        //console.table(tmpCopy.pieces);
                        tmpCopy.currentlyWhite = true;
                        tmpCopy.move(a[0], a[1], i, n, true);
                        ////console.log("Moved");
                    }
                }
            }
            if (m8) {
                //console.log("Checkmate, black won");
                this.cmW = true;
            }
        } else if (this.chB) {
            let m8 = true;
            for (let i = 0; i < this.pieces.length; i++) {
                for (let n = 0; n < this.pieces[0].length; n++) {
                    if (!this.pieces[i][n] || !this.pieces[i][n].black) {
                        continue;
                    }
                    let tmpCopy = new Board(this.user, this);
                    for (let a of tmpCopy.getPossibleMoves(i, n, false, true, true)) {
                        //console.log("New move");

                        tmpCopy.chB = false;
                        tmpCopy.currentlyWhite = false;

                        if (tmpCopy.canHit(i, n, a[0], a[1])) {
                            tmpCopy.move(i, n, a[0], a[1], true);
                        } else {
                            continue;
                        }
                        if (!tmpCopy.chB) {
                            //console.log(tmpCopy);
                            //console.log("Not m8, because move to " + a[0] + " " + a[1] + " possible.");
                            m8 = false;
                            if (!checkMoves[i + "," + n]) {
                                checkMoves[i + "," + n] = [];
                            }
                            checkMoves[i + "," + n].push([a[0], a[1]]);
                        }
                        //console.table(tmpCopy.pieces);
                        tmpCopy.currentlyWhite = false;
                        tmpCopy.move(a[0], a[1], i, n, true);
                    }
                }
            }
            if (m8) {
                //console.log("Checkmate, white won");
                this.cmB = true;
            }
        }

        if (ret) {
            return checkMoves;
        } else {
            this.checkMoves = checkMoves;
        }

    }

    selectPiece(x, y) {
        if (this.cmW || this.cmB) {
            //console.log("Can't play: " + (this.cmW ? "Black" : "White") + " won")
            return;
        }
        let gridX = floor(x / SIZE);
        let gridY = floor(y / SIZE);

        if (gridX < 0 && gridX > 7 && gridY < 0 && gridX > 7) {
            return;
        }

        if (this.lastSelected && this.lastSelected.pieceType == "King") {
            if (this.castling(false, this.lastSelectedLocation[0], this.lastSelectedLocation[1], 0, this.lastSelectedLocation[1]) && gridY == this.lastSelectedLocation[1] && gridX == 1) {
                this.castling(true, this.lastSelectedLocation[0], this.lastSelectedLocation[1], 0, this.lastSelectedLocation[1]);
            }
            if (this.castling(false, this.lastSelectedLocation[0], this.lastSelectedLocation[1], 7, this.lastSelectedLocation[1]) && gridY == this.lastSelectedLocation[1] && gridX == 6) {
                this.castling(true, this.lastSelectedLocation[0], this.lastSelectedLocation[1], 7, this.lastSelectedLocation[1]);
            }
        }

        //console.log(gridX + " " + gridY);

        if (this.pieces[gridX][gridY] && !this.lastSelected && this.pieces[gridX][gridY].black != this.currentlyWhite) { // && this.pieces[gridX][gridY].black == this.user
            this.pieces[gridX][gridY].selected = true;
            this.lastSelected = this.pieces[gridX][gridY];
            this.lastSelectedLocation = [gridX, gridY];
        } else if (this.lastSelected && this.possibleMoves && this.includes2D(this.possibleMoves, gridX, gridY)) {
            this.move(this.lastSelectedLocation[0], this.lastSelectedLocation[1], gridX, gridY);
            this.lastSelected.selected = false;
            this.lastSelected = undefined;
            //console.log("moved");
        } else if (this.lastSelected) {
            this.lastSelected.selected = false;
            this.lastSelected = undefined;
        }
        ////console.log(this.includes2D(gridX, gridY));
        ////console.log(gridX + " " + gridY + "  " + this.possibleMoves[0][0] + " " + this.possibleMoves[0][1]);
    }

    loop(loopFunc, ...args) {
        for (let x of this.pieces) {
            for (let y of x) {
                loopFunc(y, args);
            }
        }
    }
}
