const engine = require('../engine.js');
const Ball = require('./Ball.js');
const global = require('../globals.js');
const Wall = require('./Wall.js');

class Portal extends Wall {

    constructor(x, y, w, playerID, color) {
        super(x, y, w, w);
        this.playerID = playerID;
        this.color = color;
        this.shape = engine.shapes.PORTAL;

        this.portalRect = {
            x: this.x + 5, y: this.y + 5,
            width: this.width - 10, height: this.height - 10
        };

        this.portalWall = engine.place_meeting(this.portalRect.x, this.portalRect.y,
            this.portalRect.width, this.portalRect.height, Wall);



        this.targetPortal = null;

        if (this.playerID == 1) {
            if (this.color == "red" && global.bluePortal_1) {
                this.targetPortal = global.bluePortal_1;
                global.bluePortal_1.targetPortal = this;
                this.portalWall.shape = null;
            }
            else if (this.color == "blue" && global.redPortal_1) {
                this.targetPortal = global.redPortal_1;
                global.redPortal_1.targetPortal = this;
                this.portalWall.shape = null;
            }
        }
        else if (this.playerID == 2) {
            if (this.color == "red" && global.bluePortal_2) {
                this.targetPortal = global.bluePortal_2;
                global.bluePortal_2.targetPortal = this;
                this.portalWall.shape = null;
            }
            else if (this.color == "blue" && global.redPortal_2) {
                this.targetPortal = global.redPortal_2;
                global.redPortal_2.targetPortal = this;
                this.portalWall.shape = null;
            }
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


}

module.exports = Portal;