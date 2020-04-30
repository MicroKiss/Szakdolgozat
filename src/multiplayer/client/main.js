//kliens

import global from "./globals.js";
import engine from "./engine.js";
import Ball from "./Ball.js";
import Wall from "./Wall.js";
import display from "./display.js";
import RoundedWall from "./Wall2.js"
import gameLogic from "./gameLogic.js"
import mapLoader from "./mapLoader.js"


var ws = new WebSocket('ws://localhost:12345');
ws.onmessage = function (event) {


    const state = JSON.parse(event.data);
    switch (state.type) {
        case "maplayout":

            global.entities = [];
            state.body.forEach(msg => {
                let obj;
                switch (msg.shape) {
                    case "square":
                        obj = new Wall(msg.x, msg.y, msg.width);
                        global.entities.push(obj)
                        break;
                    case "circle":
                        obj = new Ball(msg.x, msg.y, msg.r);
                        global.entities.push(obj)
                        break;

                    default:
                        break;
                }
            });
            break;
        case "dynamic":
            global.entities = global.entities.filter(ent => ent.shape != "circle");
            state.body.forEach(msg => {

                let obj;
                switch (msg.shape) {
                    case "square":
                        obj = new Wall(msg.x, msg.y, msg.width);
                        global.entities.push(obj)
                        break;
                    case "circle":
                        obj = new Ball(msg.x, msg.y, msg.r);
                        global.entities.push(obj)
                        break;

                    default:
                        break;
                }
            });
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


    if (e.button === 2 || e.button === 0) {

        ws.send(JSON.stringify({ command: 'click', x: mouseX, y: mouseY }));

    }
}




function main() {

    display.draw(global.entities);
    requestAnimationFrame(main);
}

main();