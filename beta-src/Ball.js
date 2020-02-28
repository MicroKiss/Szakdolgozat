import fw from "./framework.js";


export default class Ball extends fw.Entity {

    constructor(x, y, r, vx, vy) {
        super(x, y);
        this.r = r
        this.mass = this.r * this.r * 3.14159
        this.vx = vx
        this.vy = vy
        this.ax = 0
        this.ay = 0
        this.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
        this.friction = 0.8;
        this.w = NaN
        this.h = NaN
    }

    update(deltaTime) {
        this.ax = -this.vx * this.friction;
        this.ay = -this.vy * this.friction;
        this.vx += this.ax * deltaTime;
        this.vy += this.ay * deltaTime;
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;



        if (this.x < -this.r)
            this.x = this.w + this.r
        else if (this.x > this.w + this.r)
            this.x = -this.r

        if (this.y < -this.r)
            this.y = this.h + this.r
        else if (this.y > this.h + this.r)
            this.y = -this.r

        if (Math.abs(this.vx) < 0.01)
            this.vx = 0
        if (Math.abs(this.vy) < 0.01)
            this.vy = 0

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