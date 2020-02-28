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
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < r1 + r2;
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
        query: function (self) {
            let left = self.getLeft();
            let top = self.getTop();
            let width = self.getWidth();
            let height = self.getHeight();
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

                        if (!engine.doEntitiesIntersect(self, entity)) {
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
        null;
        //TODO

    }
};


engine.simulatePhysics = function (entities) {
    //get fps   
    let deltaTime = 0.05;

    index = engine.createIndex(entities);



    for (let entity of entities) {
        entity.physicsUpdate(deltaTime);
        const others = index.query(entity.getLeft(), entity.getTop(), entity.getWidth(), entity.getHeight());
        others.forEach(other => {
            engine.handleCollision(entity, other, deltaTime);
        });
        //csinaljanak dolgokat
    }
};


engine.place_meeting = function (x, y, w, h, obj) {

    const entities = gameContext.index.query(
        x,
        y,
        this.getWidth(),
        this.getHeight()
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

