import global from "./globals.js";
import Ball from "./Ball.js";
import Wall from "./Wall.js";
import RoundedWall from "./Wall2.js"



var gameLogic = {};

var selectedball = NaN;
var mouseX;
var mouseY;
var mouseBtn;


document.oncontextmenu = (e) => { e.preventDefault(); };


document.onmousemove = (e) => {

    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

}

document.onmousedown = function (e) {
    e.preventDefault();
    mouseBtn = e.button;


    if (e.button === 2 || e.button === 0) {

        for (const ball of global.entities) {
            if (ball instanceof Ball) {
                let Distance = Math.sqrt(
                    Math.pow(ball.x - mouseX, 2) + Math.pow(ball.y - mouseY, 2));

                if (Distance < ball.r) {
                    selectedball = ball;
                    break;
                }
            }

        }
    }
    else if (e.button === 1) {
        global.entities.push(new Ball(mouseX, mouseY, global.ballRadius))
    }
}

document.onmouseup = function (e) {
    e.preventDefault();
    if (e.button === 2) {

        if (selectedball) {
            let vectorx = selectedball.x - mouseX;
            let vectory = selectedball.y - mouseY;

            selectedball.vx = 5 * vectorx;
            selectedball.vy = 5 * vectory;
        }
    }
    selectedball = NaN;
}



document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 'L'.charCodeAt(0):
            global.PhysicsPrecision += 100;
            global.PhysicsPrecision = 100 + (global.PhysicsPrecision - 100) % 1100;
            engine.PhysicsPrecision = 1 / global.PhysicsPrecision;
            break;
        default:
            break;
    }
}


gameLogic.update = function () {
    if (selectedball && mouseBtn == 0) {
        let vectorx = mouseX - selectedball.x;
        let vectory = mouseY - selectedball.y;
        let epsilon = Math.PI * 5;
        selectedball.vx += vectorx * epsilon;
        selectedball.vy += vectory * epsilon;
        selectedball.vx *= 0.6;
        selectedball.vy *= 0.6;
    }

};

export default gameLogic;