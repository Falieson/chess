class Node {
    constructor(data, parent) {
        this.data = data;
        this.parent = parent;
        this.children;
        this.done = false;
        this.black = !this.data.userPlaysBlack;
    }

    score() {
        let score = {
            "safe": 0
        };

        if (this.black) {
            if (this.data.cmB) {
                return -Infinity;
            }
            if (this.data.chB) {
                score.safe -= 350;
            }
            if (this.data.chW) {
                score.safe += 350;
            }
        }
        if (!this.black) {
            if (this.data.cmW) {
                return -Infinity;
            }
            if (this.data.chW) {
                score.safe -= 350;
            }
            if (this.data.chW) {
                score.safe += 350;
            }
        }
        this.data.loop((cell, score) => {
            if (cell) {
                switch (cell.pieceType) {
                    case "King":
                        score.safe += 500 * cell.black !== this.black ? 1 : -1;
                        break;
                    case "Queen":
                        score.safe += 400 * cell.black !== this.black ? 1 : -1;
                        break;
                    case "Bishop":
                        score.safe += 250 * cell.black !== this.black ? 1 : -1;
                        break;
                    case "Knight":
                        score.safe += 215 * cell.black !== this.black ? 1 : -1;
                        break;
                    case "Rook":
                        score.safe += 300 * cell.black !== this.black ? 1 : -1;
                        break;
                    case "Pawn":
                        score.safe += 50 * cell.black !== this.black ? 1 : -1;
                        break;
                }
            }
        }, score);

        return score.safe;
    }

    isDone() {

    }

    getChildren() {
        let children = [];
        for (let x = 0; x < this.data.pieces.length; x++) {
            for (let y = 0; y < this.data.pieces[0].length; y++) {
                if (this.data.pieces[x][y]) {
                    if (this.data.pieces[x][y].black !== this.data.userPlaysBlack) {
                        for (let move of this.data.getPossibleMoves(x, y, false, true, true)) {
                            let board = new Board(this.data.userPlaysBlack, this.data);
                            board.move(x, y, move[0], move[1], false);
                            if (!board.isEqual(this.data.pieces, board.pieces)) {
                                children.push(new Node(board), this);
                            }
                        }
                    }
                }
            }
        }
        this.children = children.splice();
        return children;
    }
}


let Algorithm = {};

Algorithm.minmax = {};

Algorithm.minmax.normal = function(position, depth, maximizingPlayer) {
    if (!position.data) {
        position = new Node(position);
    }
    if (depth == 0 || position.isDone()) {
        return position.score();
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (let child of position.getChildren()) {
            let eval = Algorithm.minmax.normal(child, depth - 1, false);
            maxEval = Math.max(maxEval, eval);
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let child of position.getChildren()) {
            let eval = Algorithm.minmax.normal(child, depth - 1, true);
            minEval = Math.min(minEval, eval);
        }
        return minEval;
    }
}

Algorithm.minmax.alphaBetaBestPosition;

Algorithm.minmax.alphaBetaAsyncIsRunning = false;

Algorithm.minmax.alphaBetaResult = function(){
    let bestPos = Algorithm.minmax.alphaBetaBestPosition;
    let history = [];
    while(bestPos.parent !== undefined){
        history.push(bestPos);
        bestPos = bestPos.parent;
    }
    console.log(bestPos);
    return history[history.length-2];
}

Algorithm.minmax.alphaBetaAsync = function(position, depth, alpha, beta, maximizingPlayer){
    return new Promise((resolve, reject) => {
        Algorithm.minmax.alphaBetaAsyncIsRunning = true;
        let cur = Algorithm.minmax.alphaBeta(position, depth, alpha, beta, maximizingPlayer);
        resolve();
    });
}

Algorithm.minmax.alphaBeta = function(position, depth, alpha, beta, maximizingPlayer) {
    if (!position.data) {
        position = new Node(position);
    }
    if (depth == 0 || position.isDone()) {
        return position.score();
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (let child of position.getChildren()) {
            let eval = Algorithm.minmax.alphaBeta(child, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, maxEval);
            if (alpha >= beta) {
                if (!Algorithm.minmax.alphaBetaBestPosition || child.score() > Algorithm.minmax.alphaBetaBestPosition.score()) {
                    Algorithm.minmax.alphaBetaBestPosition = child;
                }

                break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let child of position.getChildren()) {
            let eval = Algorithm.minmax.alphaBeta(child, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, minEval);
            if (alpha >= beta) {
                break;
            }
        }
        return minEval;
    }
}
