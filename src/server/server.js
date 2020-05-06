//szerver
var ws = require('ws');

const global = require('./globals.js');
const engine = require('./engine.js');
const Ball = require('./Ball.js');
const Portal = require('./Portal.js');
const Wall = require('./Wall.js');

var connections = [];
class Server {
    constructor(ip, port) {
        this.ws = new ws.Server({ port: port, host: ip });
        console.log("server is running");

        this.ws.on('connection', function (connection) {
            if (global.playerID > 2) {
                connection.close();
                console.log("someone tried to conenct who couldn't fit in");

                return;
            }
            connections.push(connection);
            connection.playerID = global.playerID++;
            connection.send(JSON.stringify({ command: "playerID", playerID: connection.playerID }));
            console.log('player joined id: ', connection.playerID);


            connection.on('close', function () {
                console.log("player left with id: ", connection.playerID);
                global.playerID--;
                if (connections[0])
                    connections[0].playerID = 1;
                let index = connections.indexOf(connection);
                if (index > -1)
                    connections.splice(index, 1);
                clearInterval(timer);
                clearportals();
            });

            //send the map data once 
            global.entities.forEach(entity => {
                Server.prototype.sendCreate([connection], entity);
            })

            //we always send the changes
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
            }, 10);

            connection.on('message', function (message) {
                message = JSON.parse(message);
                switch (message.command) {
                    case "create":
                        let newEntity;
                        switch (message.type) {
                            case "Ball":
                                if (!engine.point_meeting(message.body.x, message.body.y, Wall))
                                    newEntity = new Ball(message.body.x, message.body.y, global.ballRadius, 0, 0)
                                break;
                            case "Portal":
                                global.entities.forEach(e => {
                                    if (e instanceof Wall) {
                                        let center = e.getCenter();
                                        let Distance = Math.sqrt(
                                            Math.pow(center.x - message.body.x, 2) + Math.pow(center.y - message.body.y, 2));

                                        if (Distance > global.gridSize / 2)
                                            return;

                                        //you can't place a portal next to another
                                        if (engine.point_meeting(e.x - e.width / 2, e.y + e.height / 2, Portal))
                                            return;
                                        if (engine.point_meeting(e.x + 3 * e.width / 2, e.y + e.height / 2, Portal))
                                            return;
                                        if (engine.point_meeting(e.x + e.width / 2, e.y - e.width / 2, Portal))
                                            return;
                                        if (engine.point_meeting(e.x + e.width / 2, e.y + 3 * e.width / 2, Portal))
                                            return;
                                        if (engine.point_meeting(e.x + e.width / 2, e.y + e.width / 2, Portal))
                                            return;

                                        newEntity = newPortal(message, e);
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
                        break;
                    case 'clearportals':
                        clearportals();
                        break;
                    case 'moveBall':
                        global.entities.forEach(e => {
                            if (e.id == message.body.ballID) {
                                e.vx = 10 * (message.body.x - e.x);
                                e.vy = 10 * (message.body.y - e.y);
                                return false;
                            }
                        });

                        break;
                    default:
                        break;
                }
            });
        });
    }


}
Server.prototype.sendRemoveByID = function (conns, id) {
    conns.forEach(conn => {
        conn.send(JSON.stringify({
            command: "remove", id: id
        }));
    })
};
Server.prototype.sendCreate = function (conns, entity) {
    conns.forEach(conn => {

        let message_to_send = {
            command: "create", type: entity.constructor.name, body:
            {
                id: entity.id, sx: entity.sx, sy: entity.sy, ex: entity.ex, ey: entity.ey, x: entity.x, y: entity.y, color: entity.color, width: entity.width, r: entity.r
            }
        };
        if (entity.constructor.name === Portal.name) {

            message_to_send.body.playerID = entity.playerID;
        }
        conn.send(JSON.stringify(message_to_send));
    })
};


function newPortal(message, e) {
    let newEntity = new Portal(e.x, e.y, e.width, message.playerID, message.body.color);
    if (message.playerID == 1) {
        if (newEntity.color == "red") {
            if (global.redPortal_1) {
                let index = global.entities.indexOf(global.redPortal_1);
                global.entities.splice(index, 1);
                Server.prototype.sendRemoveByID(connections, global.redPortal_1.id);
                global.redPortal_1.portalWall.shape = engine.shapes.SQUARE;
            }
            global.redPortal_1 = newEntity;
        }
        else if (newEntity.color == "blue") {
            if (global.bluePortal_1) {
                let index = global.entities.indexOf(global.bluePortal_1);
                global.entities.splice(index, 1);
                Server.prototype.sendRemoveByID(connections, global.bluePortal_1.id);
                global.bluePortal_1.portalWall.shape = engine.shapes.SQUARE;
            }
            global.bluePortal_1 = newEntity;
        }
        if (global.bluePortal_1 && global.redPortal_1) {
            global.bluePortal_1.portalWall.shape = null;
            global.redPortal_1.portalWall.shape = null;
            global.bluePortal_1.portalWall.color = "black";
            global.redPortal_1.portalWall.color = "black";
        }
    }
    else if (message.playerID == 2) {
        if (newEntity.color == "red") {
            if (global.redPortal_2) {
                let index = global.entities.indexOf(global.redPortal_2);
                global.entities.splice(index, 1);
                Server.prototype.sendRemoveByID(connections, global.redPortal_2.id);
                global.redPortal_2.portalWall.shape = engine.shapes.SQUARE;
            }
            global.redPortal_2 = newEntity;
        }
        else if (newEntity.color == "blue") {
            if (global.bluePortal_2) {
                let index = global.entities.indexOf(global.bluePortal_2);
                global.entities.splice(index, 1);
                Server.prototype.sendRemoveByID(connections, global.bluePortal_2.id);
                global.bluePortal_2.portalWall.shape = engine.shapes.SQUARE;
            }
            global.bluePortal_2 = newEntity;
        }
        if (global.bluePortal_2 && global.redPortal_2) {
            global.bluePortal_2.portalWall.shape = null;
            global.redPortal_2.portalWall.shape = null;
        }
    }
    return newEntity;
}


function clearportals() {
    if (global.bluePortal_1) {
        let index = global.entities.indexOf(global.bluePortal_1);
        global.entities.splice(index, 1);
        Server.prototype.sendRemoveByID(connections, global.bluePortal_1.id)
        global.bluePortal_1.portalWall.shape = engine.shapes.SQUARE;
    }
    if (global.redPortal_1) {
        let index = global.entities.indexOf(global.redPortal_1);
        global.entities.splice(index, 1);
        Server.prototype.sendRemoveByID(connections, global.redPortal_1.id)
        global.redPortal_1.portalWall.shape = engine.shapes.SQUARE;
    }
    if (global.bluePortal_2) {
        let index = global.entities.indexOf(global.bluePortal_2);
        global.entities.splice(index, 1);
        Server.prototype.sendRemoveByID(connections, global.bluePortal_2.id)
        global.bluePortal_2.portalWall.shape = engine.shapes.SQUARE;
    }
    if (global.redPortal_2) {
        let index = global.entities.indexOf(global.redPortal_2);
        global.entities.splice(index, 1);
        Server.prototype.sendRemoveByID(connections, global.redPortal_2.id)
        global.redPortal_2.portalWall.shape = engine.shapes.SQUARE;
    }
    global.redPortal_2 = null;
    global.bluePortal_2 = null;
    global.redPortal_1 = null;
    global.bluePortal_1 = null;
}

module.exports = Server;