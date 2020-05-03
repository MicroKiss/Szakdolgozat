
import global from "./globals.js"

var display = {
    backgroundColor: "white",
    ctx: document.getElementById('canvas').getContext('2d'),
    canvas: document.getElementById('canvas'),
};


const canvas = document.getElementById('canvas');

canvas.width = innerWidth * 0.65;
canvas.height = innerHeight * 0.8;
window.onresize = function (event) {
    display.canvas.width = innerWidth * 0.65;
    display.canvas.height = innerHeight * 0.8;

};

display.drawBackground = function () {
    display.ctx.fillStyle = display.backgroundColor;
    display.ctx.fillRect(0, 0, 1920, 1080);
}

display.drawGUI = function () {
    ///fps
    display.ctx.font = "30px Arial";
    display.ctx.fillStyle = "red";
    display.ctx.textAlign = "center";
    display.ctx.fillText("fps: " + (1 / global.deltaTime).toFixed(2), display.canvas.width - 100, 50);
    display.ctx.fillText("physics simulation per sec: " + global.PhysicsPrecision, display.canvas.width - 220, 100);

}

display.draw = function (entities) {
    display.ctx.scale(innerWidth / 1920, innerHeight / 1080);
    display.drawBackground();
    entities.forEach(element => {
        element.draw(display.ctx)
    });
    display.drawGUI();
    display.ctx.setTransform(1, 0, 0, 1, 0, 0);
};


export default display;

