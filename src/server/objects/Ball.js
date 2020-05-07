const engine = require('../engine.js');




class Ball extends engine.Entity {

    constructor(x, y, r, vx, vy) {
        super(x, y, 2 * r, 2 * r, engine.shapes.CIRCLE);
        this.r = r;
        this.mass = ((this.r / 5) ** 2) * Math.PI;

        this.vx = vx | 0;
        this.vy = vy | 0;
    }


    physicsUpdate(deltaTime) {
        let gravityForce = engine.gravity * deltaTime;

        this.ax = -this.vx * engine.friction;
        this.ay = -this.vy * engine.friction * 0.5;
        this.vx += this.ax * deltaTime;
        this.vy += this.ay * deltaTime + gravityForce;
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        if (Math.abs(this.vx) < 0.01)
            this.vx = 0
        if (Math.abs(this.vy) < 0.01)
            this.vy = 0

    }


    getCenter() {
        return { x: this.x, y: this.y };
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

module.exports = Ball;