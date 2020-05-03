
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
    ///fps
    display.ctx.font = "30px Arial";
    display.ctx.fillStyle = "red";
    display.ctx.textAlign = "center";
    display.ctx.fillText("fps: " + (1 / global.deltaTime).toFixed(2), display.canvas.width - 100, 50);
    display.ctx.fillText("physics simulation per sec: " + global.PhysicsPrecision, display.canvas.width - 220, 100);

}

display.draw = function (entities) {
    display.drawBackground();
    entities.forEach(element => {
        element.draw(display.ctx)
    });
    display.drawGUI();
};


export default display;

