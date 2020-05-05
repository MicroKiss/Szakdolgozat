const global = require('./globals.js');
const Ball = require('./Ball.js');
const Wall = require('./Wall.js');
const RoundWall = require('./RoundWall.js');


const W = Wall;
const _ = null;
const B = Ball;

class mapLoader {

    constructor() {
        this.setMap();
    };




    setMap()  //you can switch between gamerooms with this function
    {

        var palya = [];
        palya = [
            [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,],
            [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,],
        ];
        global.entities.push(new RoundWall(5 * global.gridSize, 5 * global.gridSize, 10 * global.gridSize, 5 * global.gridSize, global.ballRadius));
        global.entities.push(new RoundWall(5 * global.gridSize, 10 * global.gridSize, 10 * global.gridSize, 10 * global.gridSize, global.ballRadius));
        global.entities.push(new RoundWall(10 * global.gridSize, 5 * global.gridSize, 10 * global.gridSize, 10 * global.gridSize, global.ballRadius));
        global.entities.push(new RoundWall(5 * global.gridSize, 10 * global.gridSize, 5 * global.gridSize, 8 * global.gridSize, global.ballRadius));


        global.entities.push(new RoundWall(18 * global.gridSize, 10 * global.gridSize, 20 * global.gridSize, 8 * global.gridSize, global.ballRadius));
        global.entities.push(new RoundWall(24 * global.gridSize, 13 * global.gridSize, 20 * global.gridSize, 12 * global.gridSize, global.ballRadius));
        global.entities.push(new RoundWall(19 * global.gridSize, 11 * global.gridSize, 20 * global.gridSize, 12 * global.gridSize, global.ballRadius));


        for (let i = 0; i < palya.length; i++) {
            const row = palya[i];
            for (let j = 0; j < row.length; j++) {
                const type = row[j];
                if (!type) {
                    continue;
                }
                let obj;
                switch (type) {
                    case Ball:
                        obj = new type(j * global.gridSize, i * global.gridSize, global.ballRadius);
                        break;

                    default:
                        obj = new type(j * global.gridSize, i * global.gridSize, global.gridSize);
                        break;
                }
                global.entities.push(obj)

            }
        }

    }//setmap

}//Maps


module.exports = mapLoader;