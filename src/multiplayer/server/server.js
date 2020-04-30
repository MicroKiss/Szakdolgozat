//szerver
var ws = require('ws');



let world = new Set([
    {x:10,y:10},
    {x: 200, y:50}
]);

var wss = new ws.Server({port: 12345, host: '127.0.0.1'});
console.log('Server is running');

wss.on('connection', function (connection) {
    let id = 0;
   console.log('valaki belépett!');
   const player = {x: Math.random()*700, y: Math.random()*500};
   world.add(player);

   connection.on('close', function () {
       world.delete(player);
       clearInterval(timer);
   });

   connection.on('message', function (message) {
       const command = JSON.parse(message);
       id = command.id;
        const key = command.key;

        switch(key){
            case 37:
                player.x-=5;
                break;
            case 38:
                player.y-=10;
                break;
            case 39:
                player.x+=10;
                break;
            case 40:
                player.y+=10;
                break;
        }
   });

   const timer = setInterval(()=>{
       try{
        const worldArray = Array.from(world);
        connection.send(JSON.stringify({
            id: id,
            world:worldArray,
            playerIndex: worldArray.indexOf(player)
        }));
       }catch(e){
        console.log('error');
       }
   }, 1);

});
