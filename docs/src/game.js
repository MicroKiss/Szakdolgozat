
import global from "./globals.js";
import engine from "./engine.js";
import display from "./display.js";
import gameLogic from "./gameLogic.js"
import mapLoader from "./mapLoader.js"
//npx http-server -c-1





Map = new mapLoader();


alert("you can change the physics precision by pressing 'L'")

function main() {

    engine.simulatePhysics(global.entities);
    display.draw(global.entities);




    requestAnimationFrame(main);
}

main();