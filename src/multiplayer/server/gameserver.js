//szerver

const global = require('./globals.js');
const engine = require('./engine.js');
const mapLoader = require('./mapLoader.js');

const Ball = require('./Ball.js');
const Portal = require('./Portal.js');
const Wall = require('./Wall.js');

const Server = require('./server.js');

var Map = new mapLoader();

var server = new Server('192.168.0.106', '80');

function main() {
    engine.simulatePhysics(global.entities);
}
function run() {
    setInterval(main, 30);
};

run();