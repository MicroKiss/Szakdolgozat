
export default class Unreachable {

    constructor(x, y, w, h = w) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = "rgba(50, 50, 50, 0.5)";
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //tmp

    }

}