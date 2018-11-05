class Sprite {
    constructor() {
        this.spriteSize = sprite.height / 2;

        this.sprites = new Array(2).fill(0).map(x => Array(6));
        for (let i = 0; i < 2; i++) {
            for (let n = 0; n < 6; n++) {
                this.sprites[i][n] = sprite.get(n * this.spriteSize, i * this.spriteSize, this.spriteSize, this.spriteSize)
            }
        }
    }

    get(i, n) {
        return this.sprites[n][i];
    }

    resize(height) {
        this.spriteSize = height;
        for (let b of this.sprites) {
            for (let a of b) {
                a.resize(height, 0);
            }
        }
    }
}
