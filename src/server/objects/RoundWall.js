
const engine = require('../engine.js');


class RoundWall extends engine.Entity {

    constructor(sx, sy, ex, ey, r) {
        super(Math.min(sx, ex) - r, Math.min(sy, ey) - r, Math.abs(ex - sx) + r, Math.abs(ey - sy) + r, engine.shapes.ROUNDRECTANGLE)
        this.sx = sx;
        this.sy = sy;
        this.ex = ex;
        this.ey = ey;
        this.r = r;
        this.mass = Infinity;
    }

}


module.exports = RoundWall;