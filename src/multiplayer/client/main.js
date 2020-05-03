//kliens

import global from "./globals.js";
import display from "./display.js";
import gameLogic from "./gameLogic.js";
import gameServer from "./gameserver.js";

var gameIsInActive = true;
var server;

document.querySelector("#btnConnect").addEventListener('click', e => {
    try {
        server = new gameServer(document.querySelector("#inputDestination").value)
        gameIsInActive = false;
        main();
    } catch (error) {

    }

})


function main() {
    if (gameIsInActive)
        return;
    display.draw(global.entities);

    requestAnimationFrame(main);

}
