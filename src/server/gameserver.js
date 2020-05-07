//szerver

const global = require('./globals.js');
const engine = require('./engine.js');
const config = require('./config.js');
const mapLoader = require('./mapLoader.js');

const Server = require('./server.js');



global.server = new Server(config.server_host, config.server_port);

global.mapLoader = new mapLoader();

function main() {
    engine.simulatePhysics(global.entities);
}
function run() {
    setInterval(main, 10);
};

run();