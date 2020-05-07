const global = require('./globals.js');
const { maps, roundWalls } = require('./maps/maps.js');
const Ball = require('./objects/Ball.js');
const Wall = require('./objects/Wall.js');
const RoundWall = require('./objects/RoundWall.js');
const Destination = require('./objects/Destination.js');
const Unreachable = require('./objects/Unreachable.js');


const W = Wall;
const _ = null;
const B = Ball;
const R = RoundWall;
const D = Destination;
const U = Unreachable;




class mapLoader {

    constructor() {
        this.currentMap = "e1m1";
        this.setMap(this.currentMap);
    };


    processMap(map) {
        let rwall = function (x1, y1, x2, y2) {
            return new RoundWall(x1 * global.gridSize, y1 * global.gridSize, x2 * global.gridSize, y2 * global.gridSize, global.ballRadius);
        }

        let helper = {};

        for (let i = 0; i < map.length; i++) {
            const row = map[i];
            for (let j = 0; j < row.length; j++) {
                const type = row[j];
                if (!type) {
                    continue;
                }
                let obj;
                if (roundWalls.has(type)) {
                    if (helper[type.id] == undefined) {
                        helper[type.id] = [j, i];
                    }
                    else {
                        obj = rwall(j, i, helper[type.id][0], helper[type.id][1]);
                    }
                }
                else
                    switch (type) {
                        case Ball:
                            obj = new type(j * global.gridSize, i * global.gridSize, global.ballRadius);
                            break;
                        case Wall:
                            obj = new type(j * global.gridSize, i * global.gridSize, global.gridSize);
                            break;
                        case Destination:
                            if (helper.destination == undefined)
                                helper.destination = [j, i];
                            else {
                                obj = new type(helper.destination[0] * global.gridSize, helper.destination[1] * global.gridSize,
                                    global.gridSize * (j - helper.destination[0]), global.gridSize * (i - helper.destination[1]));
                            }

                            break;
                        case Unreachable:
                            if (helper.unreachable == undefined)
                                helper.unreachable = [j, i];
                            else {
                                obj = new type(helper.unreachable[0] * global.gridSize, helper.unreachable[1] * global.gridSize,
                                    global.gridSize * (j - helper.unreachable[0]), global.gridSize * (i - helper.unreachable[1]));
                            }
                            break;
                        default:
                            break;
                    }
                if (obj)
                    global.entities.push(obj)

            }
        }
    }

    setMap(mapname)  //you can switch between gamerooms with this function
    {
        global.server.sendRemoveAll();
        global.server.clearportals();
        global.entities = [];

        if (maps[mapname] == undefined) {
            console.log("end");
            mapname = "e1m1";

        }

        let mapdata = maps[mapname];
        mapdata.body.forEach(layer => {
            this.processMap(layer);
        });

        global.server.sendCreateAll();
        this.currentMap = mapname;
        console.log("map: ", mapname);

    }//setmap

    nextMap() {
        let res = this.currentMap.split('m');
        res[0] += 'm';
        res[1]++;
        res = res[0] + res[1];
        //this.setMap(res)
        this.setMap("e1m4")

    }

}//Maps


module.exports = mapLoader;