//kliens

import global from "./globals.js";
import Ball from "./objects/Ball.js";
import Wall from "./objects/Wall.js";
import RoundWall from "./objects/RoundWall.js";
import Portal from "./objects/Portal.js";
import display from "./display.js";
import gameLogic from "./gameLogic.js";
import Destination from "./objects/Destination.js";
import Unreachable from "./objects/Unreachable.js";

class gameServer {
    constructor(destination) {
        this.ws = new WebSocket(`ws://${destination}`);
        global.ws = this.ws;
        this.ws.onclose = function (event) {
            display.drawBackground();
            console.log("server connection lost ");
            global.entities = [];
            document.querySelector("#btnConnect").disabled = false;
            global.gameIsInActive = true;
        }

        this.ws.onmessage = function (event) {
            const message = JSON.parse(event.data);
            switch (message.command) {
                case "playerID":
                    global.playerID = message.playerID;
                    break;
                case "create":
                    let obj;
                    switch (message.type) {
                        case "Wall":
                            obj = new Wall(message.body.x, message.body.y, message.body.width);
                            obj.id = message.body.id;
                            break;
                        case "RoundWall":
                            obj = new RoundWall(message.body.sx, message.body.sy, message.body.ex, message.body.ey, message.body.r);
                            obj.id = message.body.id;
                            break;
                        case "Ball":
                            obj = new Ball(message.body.x, message.body.y, message.body.r);
                            obj.id = message.body.id;
                            break;
                        case "Portal":
                            obj = new Portal(message.body.x, message.body.y, message.body.width);
                            obj.id = message.body.id;
                            if (message.body.playerID == global.playerID) {
                                obj.color = message.body.color;
                            }
                            else {
                                obj.color = "pink";
                            }
                            break;
                        case "Destination":
                            obj = new Destination(message.body.x, message.body.y, message.body.width, message.body.height);
                            obj.id = message.body.id;
                            break;
                        case "Unreachable":
                            obj = new Unreachable(message.body.x, message.body.y, message.body.width, message.body.height);
                            obj.id = message.body.id;
                            break;
                        default:
                            break;
                    }
                    if (obj)
                        global.entities.push(obj)
                    break;
                case "move":
                    let current = global.entities.find(e => { return e.id == message.id });
                    if (current) {
                        current.x = message.body.x;
                        current.y = message.body.y;
                    }
                    break;
                case "remove":
                    let index = global.entities.indexOf(global.entities.find(e => { return e.id == message.id }));
                    if (index > -1)
                        global.entities.splice(index, 1);
                    break;
                case "removeAll":
                    global.entities = [];
                    break;
                case "releaseBall":
                    if (global.selectedball.id == message.id)
                        global.selectedball = null;

                    break;

                default:
                    break;
            }



        };
    }

}

export default gameServer;