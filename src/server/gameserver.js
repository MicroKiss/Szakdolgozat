//szerver

const global = require('./globals.js');
const engine = require('./engine.js');
const config = require('./config.js');
const mapLoader = require('./mapLoader.js');

const Server = require('./server.js');

var Map = new mapLoader();

var server = new Server(config.server_host, config.server_port);

function main() {
    engine.simulatePhysics(global.entities);
}
function run() {
    setInterval(main, 10);
};

run();