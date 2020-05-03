import Ball from "./Ball.js";
import Portal from "./Portal.js";
import global from "./globals.js";



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

    if (e.button === 0 /* LMB*/) {
        global.ws.send(JSON.stringify({ command: 'create', type: Portal.name, body: { x: mouseX, y: mouseY, color: "red" } }));
    }
    else if (e.button === 1 /* MMB*/) {
        global.ws.send(JSON.stringify({ command: 'create', type: Ball.name, body: { x: mouseX, y: mouseY } }));
    }
    else if (e.button === 2 /*RMB*/) {
        global.ws.send(JSON.stringify({ command: 'create', type: Portal.name, body: { x: mouseX, y: mouseY, color: "blue" } }));
    }
}
document.onkeydown = function (e) {
    if (global.gameIsInActive)
        return;
    switch (e.keyCode) {
        case ' '.charCodeAt(0):

            global.ws.send(JSON.stringify({ command: 'clearportals' }));
            break;

        default:
            break;
    }
}



export default gameLogic;