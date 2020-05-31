
import global from "./globals.js"
var display = {
    backgroundColor: "white",
    ctx: document.getElementById('canvas').getContext('2d'),
    canvas: document.getElementById('canvas'),
    backgroundImage: new Image(),
};

display.canvas.width = innerWidth * 0.65;
display.canvas.height = innerHeight * 0.8;
window.onresize = function (event) {
    display.canvas.width = innerWidth * 0.65;
    display.canvas.height = innerHeight * 0.8;

};

//display.backgroundImage.src = './gamefiles/assets/images/backgroundTest.jpg';
display.drawBackground = function () {

    if (this.backgroundImage.src) {
        this.ctx.drawImage(this.backgroundImage, 0, -20, 1920, 1080);
    } else {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, 1920, 1080);
    }


}

display.drawGUI = function () {


}

display.draw = function (entities) {
    this.ctx.scale(display.canvas.width / 1920, display.canvas.height / 1080);
    this.drawBackground();

    entities.forEach(element => {
        element.draw(this.ctx)
    });
    this.drawGUI();
    // Reset current transformation matrix to the identity matrix
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
};


export default display;

