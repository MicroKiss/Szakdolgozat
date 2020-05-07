const engine = require('../engine.js');
const Ball = require('../objects/Ball.js');
const global = require('../globals.js')

//goal for everry level
class Destination extends engine.Entity {

    constructor(x, y, w, h = w) {
        super(x, y, w, h, engine.shapes.RECTANGLE);
        this.shape = engine.shapes.DESTINATION;
        this.tick = true;
    }

    physicsUpdate(deltaTime) {

        if (this.tick)
            if (engine.place_meeting(this.x, this.y,
                this.width, this.height, Ball)) {
                this.tick = false;
                global.mapLoader.nextMap();
            }


    }
}

module.exports = Destination;