//szerver
var ws = require('ws');
const global = require('./globals.js');
const engine = require('./engine.js');
const mapLoader = require('./mapLoader.js');

const Ball = require('./Ball.js');


let Map = new mapLoader();

var wss = new ws.Server({ port: 12345, host: '127.0.0.1' });
console.log('Server is running');

wss.on('connection', function (connection) {
    console.log('valaki belépett!');

    connection.on('close', function () {
        console.log("someone left");

        clearInterval(timer);
    });

    connection.on('message', function (message) {
        event = JSON.parse(message);
        switch (event.command) {
            case "click":
                global.entities.push(new Ball(event.x, event.y, global.ballRadius));
                break;

            default:
                break;
        }

    });
    //csak egyzser csatlakozaskor kuldi
    connection.send(JSON.stringify({ type: "maplayout", body: global.entities }));

    const timer = setInterval(() => {
        try {
            connection.send(JSON.stringify({ type: "dynamic", body: global.entities.filter(e => e.shape == "circle") }));
        } catch (e) {
            console.log('error');
        }
    }, 10);

});



function main() {
    engine.simulatePhysics(global.entities);

}


function run() {
    setInterval(main, 10);
};


run();