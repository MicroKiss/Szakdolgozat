


var display = {
    backgroundColor: "gray",
    ctx: document.getElementById('canvas').getContext('2d'),
    canvas: document.getElementById('canvas'),
};

display.drawBackground = function () {
    display.ctx.fillStyle = display.backgroundColor;
    display.ctx.fillRect(0, 0, display.canvas.width, display.canvas.height);
}

display.draw = function (entities) {
    display.drawBackground();
    entities.forEach(element => {
        element.draw(display.ctx)
    });
};


export default display;

