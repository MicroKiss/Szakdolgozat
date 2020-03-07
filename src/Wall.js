import engine from "./engine.js";


export default class Wall extends engine.Entity {

    constructor(x, y, w, h) {
        super(x, y, w, h, engine.shapes.RECTANGLE);
        this.mass = Infinity;
        this.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    }


    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //tmp

    }


}