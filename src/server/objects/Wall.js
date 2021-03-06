const engine = require('../engine.js');


//square shaped wall

class Wall extends engine.Entity {

    constructor(x, y, w, h = w) {
        super(x, y, w, h, engine.shapes.RECTANGLE);
        if (this.width === this.height)
            this.shape = engine.shapes.SQUARE;
        this.mass = Infinity;
    }

    getCorners() {
        /*  
             B     A
              ****
              ****   
              ****
            C       D
        */
        let A = { x: this.getLeft() + this.getWidth(), y: this.getTop() };
        let B = { x: this.getLeft(), y: this.getTop() };
        let C = { x: this.getLeft(), y: this.getTop() + this.getHeight() };
        let D = { x: this.getLeft() + this.getWidth(), y: this.getTop() + this.getHeight() };
        return { A: A, B: B, C: C, D: D };
    }

}

module.exports = Wall;