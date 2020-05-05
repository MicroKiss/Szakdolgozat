import global from "./globals.js";
import Ball from "./Ball.js";
import Wall from "./Wall.js";
import RoundWall from "./RoundWall.js"


const W = Wall;
const _ = null;
const B = Ball;

export default class mapLoader {

    constructor() {
        this.setMap();
    };




    setMap()  //you can switch between gamerooms with this function
    {

        var palya = [];
        palya = [
            [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, W, W, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, W, W, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, W, W, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, W, W, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, W, W, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, W, W, W, W, W, W, W, W, W, W, W, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, W, W, W, W, W, W, W, W, W, W, W, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, W, W],
            [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
            [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
        ];
        global.entities.push(new RoundWall(5 * global.gridSize, 5 * global.gridSize, 10 * global.gridSize, 5 * global.gridSize, global.ballRadius));
        global.entities.push(new RoundWall(5 * global.gridSize, 10 * global.gridSize, 10 * global.gridSize, 10 * global.gridSize, global.ballRadius));
        global.entities.push(new RoundWall(10 * global.gridSize, 5 * global.gridSize, 10 * global.gridSize, 10 * global.gridSize, global.ballRadius));
        global.entities.push(new RoundWall(5 * global.gridSize, 10 * global.gridSize, 5 * global.gridSize, 8 * global.gridSize, global.ballRadius));

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