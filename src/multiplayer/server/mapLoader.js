const global = require('./globals.js');
const Ball = require('./Ball.js');
const Wall = require('./Wall.js');
const RoundedWall = require('./Wall2.js');


const W = Wall;
const _ = null;
const B = Ball;
const R = RoundedWall;

class mapLoader {

    constructor() {
        this.setMap();
    };




    setMap()  //you can switch between gamerooms with this function
    {

        var palya = [];
        palya = [
            [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
            [W, _, _, _, _, W, _, _, _, _, _, W, _, _, W],
            [W, _, _, B, _, W, _, _, _, B, _, W, _, _, W],
            [W, _, _, _, _, W, _, _, _, _, _, W, _, _, W],
            [W, W, W, W, W, W, _, _, _, _, _, W, _, _, W],
            [W, _, _, _, _, _, W, W, W, W, W, W, _, _, W],
            [W, _, _, _, _, _, _, _, _, _, _, _, _, _, W],
            [W, _, _, _, _, _, _, _, _, _, _, _, _, _, W],
            [W, _, _, _, _, _, _, _, _, _, _, _, _, _, W],
            [W, _, _, _, _, _, _, _, _, _, _, _, _, _, W],
            [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
        ];

        for (let i = 0; i < palya.length; i++) {
            const row = palya[i];
            for (let j = 0; j < row.length; j++) {
                const type = row[j];
                if (!type) {
                    continue;
                }
                switch (type) {
                    case Ball:
                        global.entities.push(new type(j * global.gridSize, i * global.gridSize, global.ballRadius));
                        break;

                    default:
                        global.entities.push(new type(j * global.gridSize, i * global.gridSize, global.gridSize));
                        break;
                }

            }
        }

    }//setmap

}//Maps


module.exports = mapLoader;