import engine from "./engine.js";
import global from "./globals.js";
import Wall from "./Wall.js";
import Ball from "./Ball.js";


export default class Portal extends engine.Entity {

    constructor(x, y, w, color) {
        super(x, y, w, w);
        this.color = color;
        this.shape = engine.shapes.PORTAL;


        this.portalRect = {
            x: this.x + 5, y: this.y + 5,
            width: this.width - 10, height: this.height - 10
        };
        this.targetPortal = null;

        if (this.color == "red" && global.bluePortal) {
            this.targetPortal = global.bluePortal;
            global.bluePortal.targetPortal = this;
        }
        else if (this.color == "blue" && global.redPortal) {
            this.targetPortal = global.redPortal;
            global.redPortal.targetPortal = this;
        }

        this.entrance = "above";
        if (!engine.point_meeting(this.x + this.width / 2, this.y + 3 * this.height / 2, Wall))
            this.entrance = "under";
        else if (!engine.point_meeting(this.x - this.width / 2, this.y + this.height / 2, Wall))
            this.entrance = "left";
        else if (!engine.point_meeting(this.x + 3 * this.width / 2, this.y + this.height / 2, Wall))
            this.entrance = "right";
    }

    physicsUpdate(deltaTime) {

        if (!this.targetPortal)
            return;
        const others = engine.index.query(this);

        others.forEach(ball => {
            if (ball instanceof Ball) {
                //if it enters the portal
                if (engine.rectCircleColliding(this.portalRect, { x: ball.x, y: ball.y, r: 1 })) {
                    if (this.entrance == this.targetPortal.entrance) {
                        if (this.entrance == "above" || this.entrance == "under") {
                            ball.vy *= -1
                            ball.x = this.targetPortal.x + this.targetPortal.width / 2;
                            ball.y = this.targetPortal.y + this.targetPortal.height / 2 + (this.entrance == "under" ? 1 : -1) * (this.targetPortal.height / 2);
                        }
                        else if (this.entrance == "left" || this.entrance == "right") {
                            ball.vx *= -1;
                            ball.x = this.targetPortal.x + this.targetPortal.width / 2 + (this.entrance == "right" ? 1 : -1) * (this.targetPortal.width / 2);
                            ball.y = this.targetPortal.y + this.targetPortal.height / 2;
                        }
                    }
                    else if ((this.entrance == "right" && this.targetPortal.entrance == "left") || (this.entrance == "left" && this.targetPortal.entrance == "right")) {
                        ball.x = this.targetPortal.x + this.targetPortal.width / 2 + (this.entrance == "right" ? -1 : 1) * (this.targetPortal.width / 2);
                        ball.y = this.targetPortal.y + this.targetPortal.height / 2;
                    }
                    else if ((this.entrance == "above" && this.targetPortal.entrance == "under") || (this.entrance == "under" && this.targetPortal.entrance == "above")) {
                        ball.x = this.targetPortal.x + this.targetPortal.width / 2;
                        ball.y = this.targetPortal.y + this.targetPortal.height / 2 + (this.entrance == "under" ? -1 : 1) * (this.targetPortal.height / 2);
                    }
                    else if (this.entrance == "above" && (this.targetPortal.entrance == "left" || this.targetPortal.entrance == "right")) {
                        [ball.vx, ball.vy] = [ball.vy * (this.targetPortal.entrance == "left" ? -1 : 1), ball.vx * (this.targetPortal.entrance == "left" ? -1 : 1)];
                        ball.x = this.targetPortal.x + this.targetPortal.width / 2 + (this.targetPortal.entrance == "right" ? 1 : -1) * (this.targetPortal.width / 2);
                        ball.y = this.targetPortal.y + this.targetPortal.height / 2;
                    }
                    else if (this.entrance == "under" && (this.targetPortal.entrance == "left" || this.targetPortal.entrance == "right")) {
                        [ball.vx, ball.vy] = [ball.vy * (this.targetPortal.entrance == "left" ? 1 : -1), ball.vx * (this.targetPortal.entrance == "right" ? -1 : 1)];
                        ball.x = this.targetPortal.x + this.targetPortal.width / 2 + (this.targetPortal.entrance == "right" ? 1 : -1) * (this.targetPortal.width / 2);
                        ball.y = this.targetPortal.y + this.targetPortal.height / 2;
                    }
                    else if (this.entrance == "right" && (this.targetPortal.entrance == "under" || this.targetPortal.entrance == "above")) {
                        [ball.vx, ball.vy] = [ball.vy * (this.targetPortal.entrance == "under" ? -1 : 1), ball.vx * (this.targetPortal.entrance == "under" ? -1 : 1)];
                        ball.x = this.targetPortal.x + this.targetPortal.width / 2;
                        ball.y = this.targetPortal.y + this.targetPortal.height / 2 + (this.targetPortal.entrance == "under" ? 1 : -1) * (this.targetPortal.height / 2);
                    }
                    else if (this.entrance == "left" && (this.targetPortal.entrance == "under" || this.targetPortal.entrance == "above")) {
                        [ball.vx, ball.vy] = [ball.vy * (this.targetPortal.entrance == "above" ? -1 : 1), ball.vx * (this.targetPortal.entrance == "above" ? -1 : 1)];
                        ball.x = this.targetPortal.x + this.targetPortal.width / 2;
                        ball.y = this.targetPortal.y + this.targetPortal.height / 2 + (this.targetPortal.entrance == "under" ? 1 : -1) * (this.targetPortal.height / 2);
                    }
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
