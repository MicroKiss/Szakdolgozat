import Ball from './Ball.js';
import Vector from './Vector2D.js'
//npx http-server -c-1.txt

// disable right click
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);


document.addEventListener("ontouchstart", function (e) {
    e.preventDefault();
}, false);


document.addEventListener("touchmove", function (e) {
    e.preventDefault();
}, false);

document.addEventListener("onTouch", function (e) {
    e.preventDefault();
}, false);



const canvas = document.getElementById('canvas');

canvas.onscroll = function () { window.scrollTo(0, 0); }


canvas.width = innerWidth;
canvas.height = innerHeight;

const ctx = document.getElementById('canvas').getContext('2d');

const entities = [
];

var selectedball = NaN;

const MOUSEKEY = {
    NONE: 0,
    LEFT: 1,
    RIGHT: 3,
    MIDDLE: 2,
}

var MouseKey = MOUSEKEY.NONE;
var MouseX;
var MouseY;

canvas.onmousemove = function (e) {
    MouseX = e.clientX; MouseY = e.clientY;
    if (selectedball) {
        if (MouseKey == MOUSEKEY.LEFT) {
            selectedball.x = MouseX;
            selectedball.y = MouseY;
        }
    }
}

canvas.ontouchmove = function (e) {
    MouseX = e.touches[0].clientX;
    MouseY = e.touches[0].clientY;
    if (selectedball) {
        if (MouseKey == MOUSEKEY.LEFT) {
            selectedball.x = MouseX;
            selectedball.y = MouseY;
        }
    }


}

canvas.onmousedown = function (e) {

    MouseKey = e.which;

    for (const ball of entities) {
        let Distance = Math.sqrt(
            Math.pow(ball.x - MouseX, 2) + Math.pow(ball.y - MouseY, 2));

        if (Distance < ball.r) {
            selectedball = ball;
            break;
        }
    }
    // left mouse 
    if (MouseKey == MOUSEKEY.LEFT) {
    }

    //right mouse
    if (MouseKey == MOUSEKEY.RIGHT) {
    }
}

canvas.ontouchstart = function (e) {
    MouseKey = MOUSEKEY.LEFT;
    for (const ball of entities) {
        let Distance = Math.sqrt(
            Math.pow(ball.x - e.touches[0].clientX, 2) + Math.pow(ball.y - e.touches[0].clientY, 2));

        if (Distance < ball.r) {
            selectedball = ball;
            break;
        }
    }
}


canvas.onmouseup = function (e) {

    if (MouseKey == MOUSEKEY.RIGHT) {

        if (selectedball != NaN) {
            let vectorx = selectedball.x - MouseX;
            let vectory = selectedball.y - MouseY;

            selectedball.vx = 5 * vectorx;
            selectedball.vy = 5 * vectory;
        }
    }
    selectedball = NaN;
}

canvas.ontouchend = function (e) {

    if (MouseKey == MOUSEKEY.RIGHT) {

        if (selectedball != NaN) {
            let vectorx = selectedball.x - MouseX;
            let vectory = selectedball.y - MouseY;

            selectedball.vx = 5 * vectorx;
            selectedball.vy = 5 * vectory;
        }
    }
    selectedball = NaN;
}

console.log(canvas.height)
console.log(canvas.width)

for (let i = 0; i < 50; i++) {
    let x = Math.floor((Math.random() * canvas.width) + 200);
    let y = Math.floor((Math.random() * canvas.height) + 200);
    let r = Math.floor((Math.random() * 50) + 5);
    let vx = Math.floor((Math.random() * 4000) - 2000);
    let vy = Math.floor((Math.random() * 4000) - 2000);


    let ball = new Ball(x, y, r, vx, vy);
    ball.w = canvas.width;
    ball.h = canvas.height;
    entities.push(ball);
}

// let ball = new Ball(0, canvas.height / 2, 66, 1600, 0);
// ball.w = canvas.width;
// ball.h = canvas.height;
// entities.push(ball);

// ball = new Ball(canvas.width, canvas.height / 2, 66, -800, 0);
// ball.mass = 9999999;
// ball.w = canvas.width;
// ball.h = canvas.height;
// entities.push(ball);

let d = new Date();
var time = d.getTime();


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}




function update() {
    var d = new Date();
    let delta = (d.getTime() - time) / 1000;
    time = d.getTime();

    //delta = 0.001;
    for (const entity of entities) {
        entity.update(delta);
    }

    //Colliding
    for (const ball of entities) {
        for (const target of entities) {
            if (ball != target) {
                let Distance = Math.sqrt(
                    Math.pow(ball.x - target.x, 2) + Math.pow(ball.y - target.y, 2));

                if (Distance < ball.r + target.r) {

                    //Static collision
                    let Overlap = 0.5 * (Distance - ball.r - target.r);
                    ball.x -= Overlap * ((ball.x - target.x) / Distance);
                    ball.y -= Overlap * ((ball.y - target.y) / Distance);
                    target.x += Overlap * ((ball.x - target.x) / Distance);
                    target.y += Overlap * ((ball.y - target.y) / Distance);

                    // Dynamic collision

                    let v1 = new Vector(ball.vx, ball.vy);
                    let v2 = new Vector(target.vx, target.vy);
                    let m1 = ball.mass
                    let m2 = target.mass
                    let x1 = new Vector(ball.x, ball.y);
                    let x2 = new Vector(target.x, target.y);





                    let jobb_oldal = Vector.subtract(x1, x2);
                    let nevezo = ((Math.pow(Vector.subtract(x1, x2).length(), 2)));
                    let szamlalo = Vector.subtract(v1, v2).dot(Vector.subtract(x1, x2));
                    let konstans = ((2 * m2) / (m1 + m2)) * szamlalo / nevezo;

                    let first = Vector.subtract(v1, Vector.multiply(jobb_oldal, konstans));


                    jobb_oldal = Vector.subtract(x2, x1);
                    nevezo = ((Math.pow(Vector.subtract(x2, x1).length(), 2)));
                    szamlalo = Vector.subtract(v2, v1).dot(Vector.subtract(x2, x1));
                    konstans = ((2 * m1) / (m1 + m2)) * szamlalo / nevezo;

                    let second = Vector.subtract(v2, Vector.multiply(jobb_oldal, konstans));

                    ball.vx = first.x;
                    ball.vy = first.y;

                    target.vx = second.x;
                    target.vy = second.y;
                }
            }
        }

    }//~Colliding





    ctx.fillStyle = "#333333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const entity of entities) {
        entity.draw(ctx);
    }
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText('x: ' + MouseX, canvas.width / 2, 50);
    ctx.fillText('y: ' + MouseY, canvas.width / 2, 100);

    if (MouseKey == MOUSEKEY.RIGHT) {
        ctx.strokeStyle = " #00ff00";
        ctx.beginPath();
        ctx.moveTo(MouseX, MouseY);
        ctx.lineTo(selectedball.x, selectedball.y);
        ctx.stroke();

    }



    sleep(10).then(() => {
        requestAnimationFrame(update);
    })

}
sleep(10).then(() => {
    requestAnimationFrame(update);
})
