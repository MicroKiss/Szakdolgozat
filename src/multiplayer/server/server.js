//szerver
var ws = require('ws');

const global = require('./globals.js');

const Ball = require('./Ball.js');
const Portal = require('./Portal.js');
const Wall = require('./Wall.js');


var connections = [];
class Server {
    constructor(ip, port) {
        this.ws = new ws.Server({ port: port, host: ip });
        console.log("server is running");

        this.ws.on('connection', function (connection) {
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
                console.log("message: ", message);

                switch (message.command) {
                    case "create":
                        let newEntity;
                        switch (message.type) {
                            case "Ball":
                                newEntity = new Ball(message.body.x, message.body.y, global.ballRadius)
                                break;
                            case "Portal":
                                global.entities.forEach(e => {
                                    if (e instanceof Wall) {
                                        let center = e.getCenter();
                                        let Distance = Math.sqrt(
                                            Math.pow(center.x - message.body.x, 2) + Math.pow(center.y - message.body.y, 2));

                                        if (Distance < global.gridSize / 2) {
                                            //create new portal
                                            newEntity = new Portal(e.x, e.y, e.width, message.body.color);

                                            if (newEntity.color == "red") {
                                                if (global.redPortal) {
                                                    let index = global.entities.indexOf(global.redPortal);
                                                    global.entities.splice(index, 1);
                                                    Server.prototype.sendRemoveByID(connections, global.redPortal.id)
                                                    let newWall = new Wall(global.redPortal.x, global.redPortal.y, global.gridSize);
                                                    global.entities.push(newWall);
                                                    Server.prototype.sendCreate(connections, newWall);
                                                }
                                                global.redPortal = newEntity;
                                            }
                                            else if (newEntity.color == "blue") {
                                                if (global.bluePortal) {
                                                    let index = global.entities.indexOf(global.bluePortal);
                                                    global.entities.splice(index, 1);
                                                    Server.prototype.sendRemoveByID(connections, global.bluePortal.id)
                                                    let newWall = new Wall(global.bluePortal.x, global.bluePortal.y, global.gridSize);
                                                    global.entities.push(newWall);
                                                    Server.prototype.sendCreate(connections, newWall);
                                                }
                                                global.bluePortal = newEntity;
                                            }
                                            //remove wall from under it
                                            let index = global.entities.indexOf(e);
                                            global.entities.splice(index, 1);


                                            Server.prototype.sendRemoveByID(connections, e.id)

                                            return false;
                                        }
                                    }
                                })
                                break;

                            default:
                                break;
                        }

                        if (newEntity) {
                            global.entities.push(newEntity);
                            Server.prototype.sendCreate(connections, newEntity);
                        }


                    default:
                        break;
                }

            });
            //csak egyszer csatlakozaskor kuldi
            global.entities.forEach(entity => {
                Server.prototype.sendCreate([connection], entity);
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
    }


}
Server.prototype.sendRemoveByID = function (conns, id) {
    conns.forEach(conn => {
        conn.send(JSON.stringify({ command: "remove", id: id }));
    })
}
Server.prototype.sendCreate = function (conns, entity) {
    conns.forEach(conn => {
        conn.send(JSON.stringify({ command: "create", type: entity.constructor.name, body: { id: entity.id, x: entity.x, y: entity.y, color: entity.color, width: entity.width, r: entity.r } }));
    })
}


module.exports = Server;