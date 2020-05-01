
export default class Ball {

    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = "yellow";
    }

    draw(ctx) {

        ctx.moveTo(this.x, this.y)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }


}