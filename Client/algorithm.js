let constants = {};

constants.MIN = -9999;
constants.MAX = 9999;

class Algorithm {
    constructor() {
        this.tree = new Tree(3);
        console.log("Dede, tree done");
        //console.log(this.alphabeta(this.tree.initialState, 2, -Infinity, Infinity, true));
    }

    rebuildTree() {
        this.tree = new Tree(3);
    }

    move() {
        this.rebuildTree();
        this.tree.alphaBetaPruning(algo.tree.initialState, -Infinity, Infinity, 3);
    }
}

class Tree {
    constructor(ahead) {
        this.recLevel = ahead || 2;
        this.alpha = -Infinity;
        this.beta = Infinity;
        this.bestMove;
        //console.log(this.recLevel);
        this.initialState = new Node(this, new Board(false, board), undefined, 0);
        console.log("Done");
    }

    alphaBetaPruning(node, alpha, beta, depth) {
        if (depth == 0 || node instanceof EndNode) {
            return node.sc;
        }

        if (node.data.currentlyWhite == false) {
            return this.getMax(node, alpha, beta, depth);
        } else {
            return this.getMin(node, alpha, beta, depth);
        }
    }

    getMax(node, alpha, beta, depth) {
        let bestMove = [];

        for (let n of node.nodes) {
            let score = this.alphaBetaPruning(n, alpha, beta, depth - 1);
            if (score > alpha) {
                alpha = score;
                bestMove = [n];
            } else if (score == alpha) {
                bestMove.push(n);
            }

            if (alpha >= beta) {
                break;
            }
        }
        if (bestMove) {
            this.bestMove = bestMove;
        }

        return alpha;
    }

    getMin(node, alpha, beta, depth) {
        for (let n of node.nodes) {
            let score = this.alphaBetaPruning(n, alpha, beta, depth - 1);
            if (score < beta) {
                beta = score;
            }
            if (alpha >= beta) {
                break;
            }
        }
        return beta;
    }
}
class Node {
    constructor(tree, data, prevNode, recLevel) {
        //console.log("Node: " + recLevel);
        if (recLevel >= tree.recLevel) {
            //console.log("Final countdown...");
            return;
        }
        this.recLevel = recLevel;
        this.data = data;
        this.nodes = [];

        for (let i = 0; i < 8; i++) {
            for (let n = 0; n < 8; n++) {
                if (data.pieces[i][n]) {
                    if(data.chB && !data.currentlyWhite){
                        console.log("Check Black");
                        console.log(data);
                        debugger;
                        let b = new Board(false, data);
                        for(let a of data.checkm8(true, true)[i + "," + n]){
                            let b = new Board(false, data);

                        }
                        b.move(i, n, a[0], a[1]);
                        if (b.isEqual(b.pieces, data.pieces)) {
                            //console.log("same");
                            continue;
                        }
                        if (recLevel < tree.recLevel - 1 && !b.cmW && !b.cmB) {
                            //console.log("NN");
                            this.nodes.push(new Node(tree, b, this, recLevel + 1));
                        } else {
                            //console.log("EN");
                            this.nodes.push(new EndNode(b));
                        }

                    } else {
                        for (let a of data.getPossibleMoves(i, n, false, true)) {
                            let b = new Board(false, data);
                            if(a[0] === "c"){
                                //console.log("Castling possibkle");
                                b.castling(true, a[1], a[2], a[3], a[4]);
                                if(!b.isEqual(b.pieces, data.pieces)){
                                    this.nodes.push(new Node(tree, b, this, recLevel + 1));
                                }
                                continue;
                            }
                            b.move(i, n, a[0], a[1]);
                            // if (b.cmW || b.cmB) {
                            //     continue;
                            // }
                            if (b.isEqual(b.pieces, data.pieces)) {
                                //console.log("same");
                                continue;
                            }
                            if (recLevel < tree.recLevel - 1 && !b.cmW && !b.cmB) {
                                //console.log("NN");
                                this.nodes.push(new Node(tree, b, this, recLevel + 1));
                            } else {
                                //console.log("EN");
                                this.nodes.push(new EndNode(b));
                            }
                        }
                    }
                }
            }
        }
        //this.score = tree.alphabeta(this, 2, alpha, beta, recLevel % 2 == 0);
        //console.log("Dunn dunn dunn");
    }
    score() {
        return "N/A";
    }
}

class EndNode {
    constructor(b) {
        this.data = b;
        this.sc = this.score();
        //this.pieces = b.pieces.map(arr => return arr.slice());
    }

    score() {
        let b = this.data;
        let score = 0;
        b.checkm8();
        if (b.cmB) {
            return -Infinity;
        }
        if (b.cmW) {
            return Infinity;
        }

        if (b.chB) {
            score -= 300;
        }
        if (b.chW) {
            score += 300;
        }

        for (let x of b.pieces) {
            for (let y of x) {
                if (y) {
                    switch (y.pieceType) {
                        case "King":
                            score += 400 * (y.black ? 1 : -1);
                            break;
                        case "Queen":
                            score += 300 * (y.black ? 1 : -1);
                            break;
                        case "Bishop":
                            score += 100 * (y.black ? 1 : -1);
                            break;
                        case "Knight":
                            score += 100 * (y.black ? 1 : -1);
                            break;
                        case "Rook":
                            score += 100 * (y.black ? 1 : -1);
                        case "Pawn":
                            score += 20 * (y.black ? 1 : -1);
                    }
                }
            }
        }
        return score;
    }
}
