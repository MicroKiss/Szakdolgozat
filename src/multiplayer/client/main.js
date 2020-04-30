//kliens
var ws = new WebSocket('ws://localhost:12345');
ws.onmessage = function (event) {
   
    setTimeout(()=>{
        const state=JSON.parse(event.data);
        world = state.world;
        player = world[state.playerIndex];
        removeOldActions(state.id);
        for(const action of simulatedActions){
            action.fn();
        }
    }, 1);
};

let world = [];
let player;
const simulatedActions = [];

let nextId=0;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

document.body.addEventListener('keydown',(e)=>{

    const key= e.which;
    switch(key){
        case 37:
            simulate(() => player.x-=10);
            break;
        case 38:
            simulate(() => player.y-=10);
            break;
        case 39:
            simulate(() => player.x+=10);
            break;
        case 40:
            simulate(() => player.y+=10);
            break;
    }

    ws.send(JSON.stringify({command:'down', key:key, id: nextId++}));
});

function render(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for(const obj of world){
        if(obj===player){
            ctx.fillStyle='red';
        }else{
            ctx.fillStyle='black';
        }
        ctx.fillRect(obj.x, obj.y, 100,100);
    }

    requestAnimationFrame(render);
}
render();



function simulate(fn) {
    fn();
    simulatedActions.push({
        fn: fn,
        actionId: nextId 
    });
 }
 

function removeOldActions(lastActionId) {
    var toRemove = 0;
    for (var i = 0; i < simulatedActions.length; i++) {
        var action = simulatedActions[i];
        if (action.actionId <= lastActionId) {
            toRemove++;
        } else {
            break;
        }
    }
    simulatedActions.splice(0, toRemove);
 }
 