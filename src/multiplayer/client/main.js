//kliens

import global from "./globals.js";
import Ball from "./Ball.js";
import Wall from "./Wall.js";
import Portal from "./Portal.js";
import display from "./display.js";
import gameLogic from "./gameLogic.js"


var ws = new WebSocket('ws://192.168.0.106:80');
ws.onmessage = function (event) {


    const message = JSON.parse(event.data);
    switch (message.command) {
        case "create":
            console.log(message);

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
            console.log(message);

            let index = global.entities.indexOf(global.entities.find(e => { return e.id == message.id }));
            if (index > -1)
                global.entities.splice(index, 1);
            break;

        default:
            break;
    }



};



const canvas = document.getElementById('canvas');


//npx http-server -c-1



canvas.width = innerWidth - 10;
canvas.height = innerHeight - 20;

var mouseX = 0;
var mouseY = 0;
document.onmousemove = (e) => {

    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

}
document.onmousedown = function (e) {
    e.preventDefault();


    if (e.button === 2) {

        ws.send(JSON.stringify({ command: 'create', type: Portal.name, body: { x: mouseX, y: mouseY, color: "blue" } }));

    }
    else if (e.button === 0) {
        ws.send(JSON.stringify({ command: 'create', type: Portal.name, body: { x: mouseX, y: mouseY, color: "red" } }));
    }
    else if (e.button === 1) {
        ws.send(JSON.stringify({ command: 'create', type: Ball.name, body: { x: mouseX, y: mouseY } }));
    }
}




function main() {

    display.draw(global.entities);
    requestAnimationFrame(main);
}

main();