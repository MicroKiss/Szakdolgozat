import engine from "./engine.js";
import Ball from "./Ball.js";
import display from "./display.js";

//npx http-server -c-1

const canvas = document.getElementById('canvas');

canvas.width = innerWidth - 1;
canvas.height = innerHeight - 2;


const entities = [
];

let ball = new Ball(55, canvas.height / 2, 44, 600, 40);
entities.push(ball);
ball = new Ball(canvas.width, canvas.height / 2, 44, -500, 0);
entities.push(ball);

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


function main() {

    engine.simulatePhysics(entities);


    display.draw(entities);

    requestAnimationFrame(main);

}

main();