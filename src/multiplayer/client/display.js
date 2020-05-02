
import global from "./globals.js"



const canvas = document.getElementById('canvas');
window.onresize = function (event) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

};

var display = {
    backgroundColor: "white",
    ctx: document.getElementById('canvas').getContext('2d'),
    canvas: document.getElementById('canvas'),
};

display.drawBackground = function () {
    display.ctx.fillStyle = display.backgroundColor;
    display.ctx.fillRect(0, 0, display.canvas.width, display.canvas.height);
}

display.drawGUI = function () {


}

display.draw = function (entities) {
    display.ctx.scale(innerWidth / 1920, innerHeight / 1080);
    display.drawBackground();
    entities.forEach(element => {
        element.draw(display.ctx)
    });
    display.drawGUI();
    // Reset current transformation matrix to the identity matrix
    display.ctx.setTransform(1, 0, 0, 1, 0, 0);
};


export default display;

