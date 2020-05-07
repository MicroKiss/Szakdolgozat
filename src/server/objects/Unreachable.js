const engine = require('../engine.js');
const Ball = require('../objects/Ball.js');
const global = require('../globals.js')


//places where you cant move balls
class Unreachable extends engine.Entity {

    constructor(x, y, w, h = w) {
        super(x, y, w, h, engine.shapes.RECTANGLE);
        this.shape = engine.shapes.UNREACHABLE;
    }

}

module.exports = Unreachable;