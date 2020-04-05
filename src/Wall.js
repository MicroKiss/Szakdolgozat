import engine from "./engine.js";


//square shaped wall

export default class Wall extends engine.Entity {

    constructor(x, y, w) {
        super(x, y, w, w, engine.shapes.SQUARE);
        this.mass = Infinity;
        this.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    }


    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //tmp

    }
    getCenter() {
        return { x: this.x + this.getWidth() / 2, y: this.y + this.getHeight() / 2 };
    }



}