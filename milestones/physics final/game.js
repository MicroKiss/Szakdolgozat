const canvas = document.getElementById('canvas');

import global from "./globals.js";
import engine from "./engine.js";
import Ball from "./Ball.js";
import Wall from "./Wall.js";
import display from "./display.js";
import RoundedWall from "./Wall2.js"
import gameLogic from "./gameLogic.js"
import mapLoader from "./mapLoader.js"
//npx http-server -c-1



canvas.width = innerWidth - 10;
canvas.height = innerHeight - 20;


Map = new mapLoader();


function main() {

    engine.simulatePhysics(global.entities);
    display.draw(global.entities);
    gameLogic.update();




    requestAnimationFrame(main);
}

main();