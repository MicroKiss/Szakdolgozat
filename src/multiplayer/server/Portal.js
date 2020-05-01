const engine = require('./engine.js');
const Ball = require('./Ball.js');
const global = require('./globals.js');


class Portal extends engine.Entity {

    constructor(x, y, w, color) {
        super(x, y, w, w);
        this.color = color;//"#" + ((1 << 24) * Math.random() | 0).toString(16);
        this.shape = engine.shapes.PORTAL;

        this.portalRect = { x: this.x + 15, y: this.y + 15, width: this.width - 30, height: this.height - 30 };
        this.targetPortal = null;

        if (this.color == "red" && global.bluePortal)
            this.setTargetPortal(global.bluePortal);
        else if (this.color == "blue" && global.redPortal)
            this.setTargetPortal(global.redPortal);
    }

    setTargetPortal(p) {
        this.targetPortal = p;
        p.targetPortal = this;
    }

    physicsUpdate(deltaTime) {

        if (!this.targetPortal)
            return;


        const others = engine.index.query(this);

        others.forEach(other => {

            if (other instanceof Ball) {
                if (engine.rectCircleColliding(this.portalRect, { x: other.x, y: other.y, r: 1 })) {
                    let dir = other.getDir();

                    other.x = this.targetPortal.getCenter().x + dir.x * 20;
                    other.y = this.targetPortal.getCenter().y + dir.y * 20;
                }
            }

        });

    }


    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //tmp

    }
    getCenter() {
        return { x: this.x + this.getWidth() / 2, y: this.y + this.getHeight() / 2 };
    }

    getCorners() {
        /*  
             B     A
              ****
              ****   
              ****
            C       D
        */
        let A = { x: this.getLeft() + this.getWidth(), y: this.getTop() };
        let B = { x: this.getLeft(), y: this.getTop() };
        let C = { x: this.getLeft(), y: this.getTop() + this.getHeight() };
        let D = { x: this.getLeft() + this.getWidth(), y: this.getTop() + this.getHeight() };
        return { A: A, B: B, C: C, D: D };
    }

}

module.exports = Portal;