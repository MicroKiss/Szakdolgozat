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


    if (selectedball && mouseBtn == 0) {
        selectedball.vx = 0;
        selectedball.vy = 0;

        selectedball.x = mouseX;
        selectedball.y = mouseY;
    }
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

let wall_width = 300;
for (let index = 0; index < canvas.width / wall_width; index++) {
    wall = new RoundedWall(index * wall_width, canvas.height - 64, index * wall_width + wall_width, canvas.height - 84, 20);
    entities.push(wall);

}

wall = new RoundedWall(55, 700, 700, 99, 10);
entities.push(wall);

// wall = new Wall(0, 0, 50, canvas.height);
// entities.push(wall);
// wall = new Wall(canvas.width - 50, 0, 50, canvas.height);
// entities.push(wall);
//let ball = new Ball(canvas.width / 2, canvas.height, 44, 0, -300);
//entities.push(ball);
for (let i = 0; i < 20; i++) {
    let x = Math.random() * 800 + 100;
    let y = Math.random() * 200 + 100;
    let r = Math.random() * 20 + 15;
    let vx = Math.random() * 200 - 100;
    let vy = Math.random() * 200 - 100;
    let ball = new Ball(x, y, r, vx, vy);
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
    requestAnimationFrame(main);

}

main();