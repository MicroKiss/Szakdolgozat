import engine from "./engine.js";


export default class Ball extends engine.Entity {

    constructor(x, y, r, vx, vy) {
        super(x, y, 2 * r, 2 * r, engine.shapes.CIRCLE);
        this.r = r;
        this.mass = ((this.r / 5) ** 2) * Math.PI;
        console.log(this.mass);

        this.vx = vx | 0;
        this.vy = vy | 0;
        this.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    }


    physicsUpdate(deltaTime) {
        let gravityForce = this.mass * engine.gravity * deltaTime;

        this.ax = -this.vx * engine.friction;
        this.ay = -this.vy * engine.friction;
        this.vx += this.ax * deltaTime;
        this.vy += this.ay * deltaTime + gravityForce;
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

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


    getLeft() {
        return this.x - this.r;
    }

    getTop() {
        return this.y - this.r;
    }

    getWidth() {
        return this.r * 2;
    }

    getHeight() {
        return this.getWidth();
    }
}