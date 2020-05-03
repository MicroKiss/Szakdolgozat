//kliens

import global from "./globals.js";
import display from "./display.js";
import gameLogic from "./gameLogic.js";
import gameServer from "./gameserver.js";

var server;

document.querySelector("#btnConnect").addEventListener('click', e => {
    server = new gameServer(document.querySelector("#inputDestination").value)
    global.gameIsInActive = false;
    document.querySelector("#btnConnect").disabled = true;
    main();


})


function main() {
    if (global.gameIsInActive)
        return;
    display.draw(global.entities);

    requestAnimationFrame(main);

}
