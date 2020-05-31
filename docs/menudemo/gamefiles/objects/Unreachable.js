
export default class Unreachable {

    constructor(x, y, w, h = w) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = "rgba(100, 10, 30, 0.3)";
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //tmp

    }

}