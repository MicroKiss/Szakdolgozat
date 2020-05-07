import Ball from "./objects/Ball.js";
import Wall from "./objects/Wall.js";
import Portal from "./objects/Portal.js";
import global from "./globals.js";
import display from "./display.js";


var gameLogic = {};
var canvasObj = display.canvas;
document.oncontextmenu = (e) => { e.preventDefault(); };



var mouseX = 0;
var mouseY = 0;
global.selectedball = null;
canvasObj.onmousemove = (e) => {

    var rect = canvasObj.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseX /= display.canvas.width / 1920;
    mouseY = e.clientY - rect.top;
    mouseY /= display.canvas.height / 1080;

}


function sendRegularly() {
    if (global.selectedball) {
        global.ws.send(JSON.stringify({ playerID: global.playerID, command: 'moveBall', body: { x: mouseX, y: mouseY, ballID: global.selectedball.id } }));
        requestAnimationFrame(sendRegularly);
    }


}



canvasObj.onmousedown = function (e) {

    e.preventDefault();

    if (e.button === 0 /* LMB*/) {

        global.entities.forEach(e => {
            if (e.constructor.name === "Ball") {
                if (Math.hypot(mouseX - e.x, mouseY - e.y) < e.r) {
                    global.selectedball = e;
                }
            }
        });





        global.ws.send(JSON.stringify({
            playerID: global.playerID, command: 'create',
            type: Portal.name, body: { x: mouseX, y: mouseY, color: "red" }
        }));




    }
    else if (e.button === 1 /* MMB*/) {
        //global.ws.send(JSON.stringify({ playerID: global.playerID, command: 'create', type: Ball.name, body: { x: mouseX, y: mouseY } }));
    }
    else if (e.button === 2 /*RMB*/) {
        global.ws.send(JSON.stringify({
            playerID: global.playerID, command: 'create',
            type: Portal.name, body: { x: mouseX, y: mouseY, color: "blue" }
        }));
    }

    sendRegularly();
}




canvasObj.onmouseup = function (e) {
    e.preventDefault();

    if (e.button === 0 /* LMB*/) {
        global.selectedball = null;
    }
}


document.onkeydown = function (e) {
    if (global.gameIsInActive)
        return;
    switch (e.keyCode) {
        case ' '.charCodeAt(0):

            global.ws.send(JSON.stringify({ playerID: global.playerID, command: 'clearportals' }));
            break;

        default:
            break;
    }
}



export default gameLogic;