import engine from "./engine.js";
import Ball from "./Ball.js";
import Wall from "./Wall.js";
import display from "./display.js";
import RoundedWall from "./Wall2.js"

//npx http-server -c-1

const canvas = document.getElementById('canvas');

canvas.width = innerWidth - 10;
canvas.height = innerHeight - 20;

var selectedball = NaN;
var mouseX;
var mouseY;
var mouseBtn;
const entities = [
];

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

        for (const ball of entities) {
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





let wall;

// wall = new RoundedWall(0, 0, 0, innerHeight, 10);
// entities.push(wall);


//falak
wall = new Wall(0, innerHeight - 60, innerWidth, 50);
entities.push(wall);
wall = new Wall(0, 0, innerWidth, 50);
entities.push(wall);
wall = new Wall(0, 0, 20, innerHeight);
entities.push(wall);
wall = new Wall(innerWidth - 20, 0, 20, innerHeight);
entities.push(wall);


wall = new RoundedWall(200, 200, 600, 600, 10);
entities.push(wall);
wall = new Wall(innerWidth * 2 / 3, 450, 100);
entities.push(wall);


// wall = new Wall(0, 0, 50, canvas.height);
// entities.push(wall);
// wall = new Wall(canvas.width - 50, 0, 50, canvas.height);
// entities.push(wall);
//let ball = new Ball(canvas.width / 2, canvas.height, 44, 0, -300);
//entities.push(ball);
for (let i = 0; i < 100; i++) {
    let x = Math.random() * 800 + 100;
    let y = Math.random() * 200 + 100;
    let r = Math.random() * 20 + 15;
    let vx = Math.random() * 200 - 100;
    let vy = Math.random() * 200 - 100;
    let ball = new Ball(x, y, r);
    entities.push(ball);

}



// let ball = new Ball(canvas.width, canvas.height / 2 + 100, 10, -700, -50);
// entities.push(ball);


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
var ctx = document.getElementById('canvas').getContext('2d');

function main() {

    engine.simulatePhysics(entities);
    display.draw(entities);

    ///fps
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("fps: " + (1 / engine.deltaTime).toFixed(2), canvas.width - 100, 50);
    ctx.fillText("physics simulation per sec: " + parseInt(1 / engine.PhysicsPrecision), canvas.width - 220, 100);




    if (selectedball && mouseBtn == 0) {
        let vectorx = mouseX - selectedball.x;
        let vectory = mouseY - selectedball.y;
        let distance = Math.sqrt(vectorx ** 2 + vectory ** 2);
        // if (distance > 500) {
        //     selectedball.vx /= distance;
        //     selectedball.vy /= distance;

        // }
        let epsilon = Math.PI * 5;
        selectedball.vx += vectorx * epsilon;
        selectedball.vy += vectory * epsilon;
        selectedball.vx *= 0.6;
        selectedball.vy *= 0.6;
    }

    requestAnimationFrame(main);
}

main();