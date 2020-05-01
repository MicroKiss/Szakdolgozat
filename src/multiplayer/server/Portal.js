const engine = require('./engine.js');



class Portal extends engine.Entity {

    constructor(x, y, w, h = w) {
        super(x, y, w, h, engine.shapes.RECTANGLE);
        if (this.width === this.height)
            this.shape = engine.shapes.SQUARE;
        this.color = "blue";//"#" + ((1 << 24) * Math.random() | 0).toString(16);
    }


    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //tmp

    }
    getCenter() {
        return { x: this.x + this.getWidth() / 2, y: this.y + this.getHeight() / 2 };
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

module.exports = Portal;