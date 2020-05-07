const engine = require('../engine.js');
const Ball = require('../objects/Ball.js');
const global = require('../globals.js')


//square shaped wall

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

module.exports = Destination;