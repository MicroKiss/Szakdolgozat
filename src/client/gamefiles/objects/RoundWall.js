
export default class RoundWall {

    constructor(sx, sy, ex, ey, r) {
        this.x = Math.min(sx, ex) - r;
        this.y = Math.min(sy, ey) - r;
        this.width = Math.abs(ex - sx) + r;
        this.height = Math.abs(ey - sy) + r;
        this.sx = sx;
        this.sy = sy;
        this.ex = ex;
        this.ey = ey;
        this.r = r;

        this.color = "chocolate";
    }


    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.r * 2;
        ctx.beginPath();
        ctx.moveTo(this.sx, this.sy);
        ctx.lineTo(this.ex, this.ey);
        ctx.stroke();

        ctx.moveTo(this.sx, this.sy)
        ctx.beginPath();
        ctx.arc(this.sx, this.sy, this.r, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.moveTo(this.ex, this.ey)
        ctx.beginPath();
        ctx.arc(this.ex, this.ey, this.r, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
    }


}