import global from "./globals.js";
import Ball from "./Ball.js";
import Wall from "./Wall.js";
import Portal from "./Portal.js";
import engine from "./engine.js";



var gameLogic = {};

var canvasObj = document.querySelector("canvas");



const canvas = document.getElementById('canvas');


//npx http-server -c-1

document.oncontextmenu = (e) => { e.preventDefault(); };



var mouseX = 0;
var mouseY = 0;
canvasObj.onmousemove = (e) => {

    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseX /= innerWidth / 1920;
    mouseY = e.clientY - rect.top;
    mouseY /= innerHeight / 1080;

}
canvasObj.onmousedown = function (e) {
    e.preventDefault();
    let message = {};
    if (e.button === 0 /* LMB*/) {
        message = ({ command: 'create', type: Portal.name, body: { x: mouseX, y: mouseY, color: "red" } });
    }
    else if (e.button === 1 /* MMB*/) {
        message = ({ command: 'create', type: Ball.name, body: { x: mouseX, y: mouseY } });
    }
    else if (e.button === 2 /*RMB*/) {
        message = ({ command: 'create', type: Portal.name, body: { x: mouseX, y: mouseY, color: "blue" } });
    }


    switch (message.command) {
        case "create":
            let newEntity;
            switch (message.type) {
                case "Ball":
                    if (!engine.point_meeting(message.body.x, message.body.y, Wall))
                        newEntity = new Ball(message.body.x, message.body.y, global.ballRadius, 0, 0)
                    break;
                case "Portal":
                    global.entities.forEach(e => {
                        if (e instanceof Wall) {
                            let center = e.getCenter();
                            let Distance = Math.sqrt(
                                Math.pow(center.x - message.body.x, 2) + Math.pow(center.y - message.body.y, 2));

                            if (Distance < global.gridSize / 2) {
                                //create new portal

                                //you can't place a portal next to another
                                if (engine.point_meeting(e.x - e.width / 2, e.y + e.height / 2, Portal))
                                    return;
                                if (engine.point_meeting(e.x + 3 * e.width / 2, e.y + e.height / 2, Portal))
                                    return;
                                if (engine.point_meeting(e.x + e.width / 2, e.y - e.width / 2, Portal))
                                    return;
                                if (engine.point_meeting(e.x + e.width / 2, e.y + 3 * e.width / 2, Portal))
                                    return;
                                if (engine.point_meeting(e.x + e.width / 2, e.y + e.width / 2, Portal))
                                    return;

                                newEntity = new Portal(e.x, e.y, e.width, message.body.color);

                                if (newEntity.color == "red") {
                                    if (global.redPortal) {
                                        let index = global.entities.indexOf(global.redPortal);
                                        global.entities.splice(index, 1);
                                        let newWall = new Wall(global.redPortal.x, global.redPortal.y, global.gridSize);
                                        global.entities.push(newWall);
                                    }
                                    global.redPortal = newEntity;
                                }
                                else if (newEntity.color == "blue") {
                                    if (global.bluePortal) {
                                        let index = global.entities.indexOf(global.bluePortal);
                                        global.entities.splice(index, 1);
                                        let newWall = new Wall(global.bluePortal.x, global.bluePortal.y, global.gridSize);
                                        global.entities.push(newWall);
                                    }
                                    global.bluePortal = newEntity;
                                }

                                if (global.bluePortal && global.redPortal) {
                                    let br = global.bluePortal.portalRect;
                                    let wall1 = engine.place_meeting(br.x, br.y, br.width, br.height, Wall);
                                    if (wall1) {
                                        let index = global.entities.indexOf(wall1);
                                        global.entities.splice(index, 1);
                                    }
                                    let rr = global.redPortal.portalRect;
                                    let wall2 = engine.place_meeting(rr.x, rr.y, rr.width, rr.height, Wall);
                                    if (wall2) {
                                        let index = global.entities.indexOf(wall2);
                                        global.entities.splice(index, 1);
                                    }
                                }
                            }
                        }
                    })
                    break;
                default:
                    break;
            }

            if (newEntity) {
                global.entities.push(newEntity);
            }
            break;
        default:
            break;
    }
}
document.onkeydown = function (e) {
    switch (e.keyCode) {
        case ' '.charCodeAt(0):
            if (global.bluePortal) {
                let index = global.entities.indexOf(global.bluePortal);
                global.entities.splice(index, 1);
                let newWall = new Wall(global.bluePortal.x, global.bluePortal.y, global.gridSize);
                global.entities.push(newWall);
            }
            if (global.redPortal) {
                let index = global.entities.indexOf(global.redPortal);
                global.entities.splice(index, 1);
                let newWall = new Wall(global.redPortal.x, global.redPortal.y, global.gridSize);
                global.entities.push(newWall);
            }
            global.redPortal = null;
            global.bluePortal = null;
            break;
        case 'L'.charCodeAt(0):
            global.PhysicsPrecision += 100;
            global.PhysicsPrecision = 100 + (global.PhysicsPrecision - 100) % 1100;
            engine.PhysicsPrecision = 1 / global.PhysicsPrecision;
            break;
        default:
            break;
    }
}

export default gameLogic;