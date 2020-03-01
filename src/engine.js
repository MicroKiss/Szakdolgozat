
import Vector from "./Vector2D.js";



var engine = {
    gravity: 9,
    friction: 0.8,
    index: NaN,
    shapes: {
        CIRCLE: "circle",
        RECTANGLE: "rectangle",
    }
};

engine._pressedKeys = {}; //asszociatív tömbben tároljuk, hogy egy gomb le van-e nyomva
document.onkeydown = function (e) {
    engine._pressedKeys[e.which] = true;
};

document.onkeyup = function (e) {
    engine._pressedKeys[e.which] = false;
};

engine.isDown = function (key) {
    return engine._pressedKeys[key] === true;
};

engine.image = function (src) {
    var img = document.createElement('img');
    img.src = src;
    return img;
};

engine.load = function (images, onLoad, onProgress) {
    var loaded = 0;

    function checkLoaded() {
        if (onProgress) {
            onProgress(loaded / images.length * 100);
        }
        if (loaded === images.length) { //ha minden kép be volt töltve, akkor visszahívunk
            onLoad();
        }
    }

    for (var i = 0; i < images.length; i++) {
        if (images[i].width > 0) { //a kép be van töltve
            loaded++;
        } else { //eseménykezelõt rakunk a képre, ha nincs betöltve
            images[i].addEventListener('load', function () {
                loaded++;
                checkLoaded();
            });
        }
    }
    checkLoaded();
};

//teglalapok metszese
engine.rectangleIntersect = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
};
//korok metszese
engine.circleIntersect = function (x1, y1, r1, x2, y2, r2) {
    return ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) < (r1 + r2) * (r1 + r2);
}


// meg nem biztos h jo https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
engine.rectCircleColliding = function (rect, circle) {
    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) { return false; }
    if (distY > (rect.h / 2 + circle.r)) { return false; }

    if (distX <= (rect.w / 2)) { return true; }
    if (distY <= (rect.h / 2)) { return true; }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}

engine.doEntitiesIntersect = function (first, second) {
    if (first === second)
        return true;


    if (first.shape == second.shape) {
        if (first.shape == engine.shapes.RECTANGLE)
            return engine.rectangleIntersect(first.x, first.y, first.width, first.height, second.x, second.y, second.width, second.height);
        if (first.shape == engine.shapes.CIRCLE)
            return engine.circleIntersect(first.x, first.y, first.r, second.x, second.y, second.r);
    }

    if (first.shape == engine.shapes.RECTANGLE && second.shape == engine.shapes.CIRCLE)
        return engine.rectCircleColliding(first, second);
    if (second.shape == engine.shapes.RECTANGLE && first.shape == engine.shapes.CIRCLE)
        return engine.rectCircleColliding(second, first);

    return false;
}

//terbeli indexeles
engine.createIndex = function (entities, size) { //bin index készítés
    if (!size) {
        size = 64;
    }
    var grid = {};
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        //entitás szélének meghatározása (cella szélek)
        var left = entity.getLeft();
        var top = entity.getTop();
        var cellLeft = Math.floor(left / size);
        var cellTop = Math.floor(top / size);
        var cellRight = Math.floor((left + entity.getWidth()) / size);
        var cellBottom = Math.floor((top + entity.getHeight()) / size);

        //végig megyünk az összes cellán, amit érint az entitás
        for (var x = cellLeft; x <= cellRight; x++) {
            for (var y = cellTop; y <= cellBottom; y++) {
                var cellKey = key(x, y);
                var cellData = grid[cellKey]; //az adott koordinátához tartozó cella infó lekérése
                if (!cellData) { //a cella üres volt
                    grid[cellKey] = [entity]; //a cella mostantól egy elemet tartalmaz: az entitást
                } else {
                    cellData.push(entity); //a cellához hozzáadunk még egy elemet
                }
            }
        }
    }

    function key(x, y) {
        return x + ',' + y;
    }

    return {
        query: function (obj) {
            let left = obj.getLeft();
            let top = obj.getTop();
            let width = obj.getWidth();
            let height = obj.getHeight();
            let cellLeft = Math.floor(left / size);
            let cellTop = Math.floor(top / size);
            let cellRight = Math.floor((left + width) / size);
            let cellBottom = Math.floor((top + height) / size);

            var result = new Set();
            for (var x = cellLeft; x <= cellRight; x++) {
                for (var y = cellTop; y <= cellBottom; y++) {
                    var cellKey = key(x, y);
                    var cellData = grid[cellKey]; //az adott koordinátához tartozó cella infó lekérése
                    if (!cellData) { //a cellában nincs elem
                        continue;
                    }
                    for (let j = 0; j < cellData.length; j++) { //a cella minden elemét belerakjuk, ha még nem volt benne
                        var entity = cellData[j];
                        if (result.has(entity))
                            continue;
                        if (obj === entity)
                            continue;

                        if (!engine.doEntitiesIntersect(obj, entity)) {
                            continue; //ha ugyan kozel vannak de megse utkoznek
                        }
                        result.add(entity);
                    }
                }
            }
            return result;
        }
    };
};



engine.handleCollision = function (first, second, deltaTime) {
    //ball to ball
    if (first.shape == engine.shapes.CIRCLE && second.shape == first.shape) {
        engine.ballBallCollision(first, second)

        //TODO

    }
};


engine.ballBallCollision = function (ball, target) {
    if (ball === target)
        return;
    let Distance = Math.sqrt(
        Math.pow(ball.x - target.x, 2) + Math.pow(ball.y - target.y, 2));

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

engine.simulatePhysics = function (entities) {
    //TODO get fps   
    let deltaTime = 0.05;

    let index = engine.createIndex(entities);



    for (let entity of entities) {
        //csak a ra vonatkozo dolgok
        entity.physicsUpdate(deltaTime);
        //utkozesek
        const others = index.query(entity);
        others.forEach(other => {
            engine.handleCollision(entity, other, deltaTime);
        });
        //csinaljanak dolgokat
    }
};


engine.place_meeting = function (x, y, w, h, obj) {

    const entities = gameContext.index.query(new engine.Entity(
        x,
        y,
        w,
        h)
    );

    for (let entity of entities)
        if (entity instanceof obj && entity != this)
            return true;
    return false;
};



engine.Entity = class Entity {
    constructor(x, y, w, h, shape) {
        if (!shape) {
            shape = engine.shapes.RECTANGLE;
        }
        this.x = x;
        this.y = y;
        this.mass = w * h;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;

        this.width = w;
        this.height = h;
        this.shape = shape;
    }

    update() {
    }

    physicsUpdate() {
    }

    draw() {
    }

    getLeft() {
        return this.x;
    }

    getTop() {
        return this.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
};

export default engine;

