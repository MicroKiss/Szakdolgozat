
import engine from "./engine.js";


export default class RoundWall extends engine.Entity {

    constructor(sx, sy, ex, ey, r) {
        super(Math.min(sx, ex) - r, Math.min(sy, ey) - r, Math.abs(ex - sx) + r, Math.abs(ey - sy) + r, engine.shapes.ROUNDRECTANGLE)
        this.sx = sx;
        this.sy = sy;
        this.ex = ex;
        this.ey = ey;
        this.r = r;
        this.mass = Infinity;

        this.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
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