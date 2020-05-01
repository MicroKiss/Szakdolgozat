//szerver
var ws = require('ws');
const global = require('./globals.js');
const engine = require('./engine.js');
const mapLoader = require('./mapLoader.js');

const Ball = require('./Ball.js');
const Portal = require('./Portal.js');
const Wall = require('./Wall.js');

let Map = new mapLoader();

var wss = new ws.Server({ port: 80, host: 'localhost' });
console.log('Server is running');

const connections = [];
wss.on('connection', function (connection) {
    connections.push(connection);
    console.log('valaki belépett!');

    connection.on('close', function () {
        console.log("someone left");
        let index = connections.indexOf(connection);
        if (index > -1)
            connections.splice(index, 1);

        clearInterval(timer);
    });

    connection.on('message', function (message) {
        message = JSON.parse(message);
        console.log(message);

        switch (message.command) {
            case "create":
                let newEntity;
                switch (message.type) {
                    case "Ball":
                        newEntity = new Ball(message.body.x, message.body.y, global.ballRadius)
                        global.entities.push(newEntity);
                        break;
                    case "Portal":
                        global.entities.forEach(e => {
                            if (e instanceof Wall) {


                                let center = e.getCenter();
                                let Distance = Math.sqrt(
                                    Math.pow(center.x - message.body.x, 2) + Math.pow(center.y - message.body.y, 2));

                                if (Distance < global.gridSize / 2) {
                                    //replace this wall with a portal
                                    newEntity = new Portal(e.x, e.y, e.width);
                                    global.entities.push(newEntity);
                                    let index = global.entities.indexOf(e);
                                    if (index > -1)
                                        global.entities.splice(index, 1);

                                    connections.forEach(conn => {
                                        conn.send(JSON.stringify({ command: "remove", id: e.id }));
                                    })

                                    return false;
                                }
                            }
                        })
                        break;

                    default:
                        break;
                }
                console.log(newEntity);

                if (newEntity)
                    connections.forEach(conn => {
                        conn.send(JSON.stringify({ command: "create", type: newEntity.constructor.name, body: newEntity }));
                    })



            default:
                break;
        }

    });
    //csak egyszer csatlakozaskor kuldi
    global.entities.forEach(entity => {
        connection.send(JSON.stringify({ command: "create", type: entity.constructor.name, body: entity }));
    })

    const timer = setInterval(() => {
        try {
            global.entities.filter(e => (e instanceof Ball)).forEach(entity => {

                connection.send(JSON.stringify({ command: "move", id: entity.id, body: { y: entity.y, x: entity.x } }));
            })
        } catch (e) {
            //it's left before we could send this
            let index = connections.indexOf(connection);
            if (index > -1)
                connections.splice(index, 1);

        }
    }, 30);

});



function main() {
    engine.simulatePhysics(global.entities);

}


function run() {
    setInterval(main, 30);
};


run();