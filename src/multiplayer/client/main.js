//kliens

import global from "./globals.js";
import Ball from "./Ball.js";
import Wall from "./Wall.js";
import Portal from "./Portal.js";
import display from "./display.js";
import gameLogic from "./gameLogic.js"


global.ws = new WebSocket('ws://192.168.0.106:80');
global.ws.onmessage = function (event) {


    const message = JSON.parse(event.data);
    switch (message.command) {
        case "create":
            let obj;
            switch (message.type) {
                case "Wall":
                    obj = new Wall(message.body.x, message.body.y, message.body.width);
                    obj.id = message.body.id;
                    global.entities.push(obj)
                    break;
                case "Ball":
                    obj = new Ball(message.body.x, message.body.y, message.body.r);
                    obj.id = message.body.id;
                    global.entities.push(obj)
                    break;
                case "Portal":
                    obj = new Portal(message.body.x, message.body.y, message.body.width);
                    obj.id = message.body.id;
                    obj.color = message.body.color;
                    global.entities.push(obj)
                    break;

                default:
                    break;
            }

            break;
        case "move":
            let current = global.entities.find(e => { return e.id == message.id });
            current.x = message.body.x;
            current.y = message.body.y;
            break;
        case "remove":

            let index = global.entities.indexOf(global.entities.find(e => { return e.id == message.id }));
            if (index > -1)
                global.entities.splice(index, 1);
            break;

        default:
            break;
    }



};








function main() {

    display.draw(global.entities);
    requestAnimationFrame(main);
}

main();