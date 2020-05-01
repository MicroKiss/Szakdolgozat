
import global from "./globals.js"

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
    display.drawBackground();
    entities.forEach(element => {
        element.draw(display.ctx)
    });
    display.drawGUI();
};


export default display;

