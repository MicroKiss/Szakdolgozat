
const Vector = require('./Vector2D.js');
const global = require('./globals.js');

var performanceNow = require("./node_modules/performance-now")

var engine = {
    lastTick: performanceNow(),
    deltaTime: 0.1,
    PhysicsPrecision: 1 / global.PhysicsPrecision, // 1/this is the number of physics simulations /secs
    gravity: 0.8 * 1000,//cus our screen is biiig
    friction: 0.9,//0.9
    index: {},
    indexSize: 256,
    shapes: {
        CIRCLE: "circle",
        RECTANGLE: "rectangle",
        ROUNDRECTANGLE: "roundrectangle",
        SQUARE: "square",
        PORTAL: "portal",
    },

};




//teglalapok metszese
engine.rectangleIntersect = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
};
//korok metszese
engine.circleIntersect = function (x1, y1, r1, x2, y2, r2) {
    return ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) < (r1 + r2) * (r1 + r2);
}


engine.roundRectCircleIntersect = function (rect, ball) {
    // Check that line formed by velocity vector, intersects with line segment
    let fLineX1 = rect.ex - rect.sx;
    let fLineY1 = rect.ey - rect.sy;

    let fLineX2 = ball.x - rect.sx;
    let fLineY2 = ball.y - rect.sy;

    let fEdgeLength = fLineX1 * fLineX1 + fLineY1 * fLineY1;

    // This is nifty - It uses the DP of the line segment vs the line to the object, to work out
    // how much of the segment is in the "shadow" of the object vector. The min and max clamp
    // this to lie between 0 and the line segment length, which is then normalised. We can
    // use this to calculate the closest point on the line segment
    let t = Math.max(0, Math.min(fEdgeLength, (fLineX1 * fLineX2 + fLineY1 * fLineY2))) / fEdgeLength;

    // Which we do here
    let fClosestPointX = rect.sx + t * fLineX1;
    let fClosestPointY = rect.sy + t * fLineY1;

    // And once we know the closest point, we can check if the ball has collided with the segment in the
    // same way we check if two balls have collided
    let fDistance = Math.sqrt((ball.x - fClosestPointX) * (ball.x - fClosestPointX) + (ball.y - fClosestPointY) * (ball.y - fClosestPointY));

    return (fDistance <= (ball.r + rect.r));

}


// forras https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
engine.rectCircleColliding = function (rect, circle) {

    let distX = Math.abs(circle.x - rect.x - rect.width / 2);
    let distY = Math.abs(circle.y - rect.y - rect.height / 2);



    if (distX > (rect.width / 2 + circle.r)) {
        return false;
    }
    if (distY > (rect.height / 2 + circle.r)) {
        return false;
    }

    if (distX <= (rect.width / 2)) { return true; }
    if (distY <= (rect.height / 2)) { return true; }
    let dx = distX - rect.width / 2;
    let dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.r ** 2));


}

engine.doEntitiesIntersect = function (first, second) {
    if (first === second)
        return true;


    if (first.shape == second.shape) {
        if (first.shape == engine.shapes.RECTANGLE || first.shape == engine.shapes.SQUARE || first.shape == engine.shapes.PORTAL)
            return engine.rectangleIntersect(first.x, first.y, first.width, first.height, second.x, second.y, second.width, second.height);
        if (first.shape == engine.shapes.CIRCLE)
            return engine.circleIntersect(first.x, first.y, first.r, second.x, second.y, second.r);
    }


    if ((first.shape == engine.shapes.RECTANGLE || first.shape == engine.shapes.SQUARE || first.shape == engine.shapes.PORTAL) && (second.shape == engine.shapes.RECTANGLE || second.shape == engine.shapes.SQUARE || second.shape == engine.shapes.PORTAL))
        return engine.rectangleIntersect(first.x, first.y, first.width, first.height, second.x, second.y, second.width, second.height);



    if ((first.shape == engine.shapes.SQUARE || first.shape == engine.shapes.RECTANGLE || first.shape == engine.shapes.PORTAL) && second.shape == engine.shapes.CIRCLE)
        return engine.rectCircleColliding(first, second);
    // if ((second.shape == engine.shapes.SQUARE || second.shape == engine.shapes.RECTANGLE) && first.shape == engine.shapes.CIRCLE)
    //     return engine.rectCircleColliding(second, first);

    if (first.shape == engine.shapes.ROUNDRECTANGLE && second.shape == engine.shapes.CIRCLE)
        return engine.roundRectCircleIntersect(first, second);
    // if (second.shape == engine.shapes.ROUNDRECTANGLE && first.shape == engine.shapes.CIRCLE)
    //     return engine.roundRectCircleIntersect(second, first);

    return false;
}

//térbeli indexeles
engine.createIndex = function (entities, size) { //bin index készítés
    if (!size) {
        size = engine.indexSize;
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



engine.handleCollision = function (first, second) {


    if (first.shape == engine.shapes.CIRCLE && second.shape == first.shape) {
        engine.ballBallCollision(first, second);
    }
    else if (first.shape == engine.shapes.RECTANGLE && second.shape == engine.shapes.CIRCLE) {
        engine.rectBallCollision(first, second)
    }
    else if (first.shape == engine.shapes.SQUARE && second.shape == engine.shapes.CIRCLE) {
        engine.squareBallCollision(first, second)
    }
    else if (first.shape == engine.shapes.ROUNDRECTANGLE && second.shape == engine.shapes.CIRCLE) {
        engine.roundRectBallCollision(first, second)
    }

};

engine.ballBallCollision = function (ball, target) {
    if (ball === target)
        return;
    let Distance = Math.hypot(ball.x - target.x, ball.y - target.y) | 1;

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

engine.squareBallOverlap = function (square, ball) {
    /*
         top    
      B       A
       ______ 
       |    |
       |    |   right
       L____J
      C      D
         bottom
    */
    let top = square.getTop();
    let bottom = top + square.getHeight();
    let left = square.getLeft();
    let right = left + square.getWidth();
    let middle = square.getCenter()

    //ball is above the square
    if (ball.y < top) {
        //around 'B' point
        if (ball.x < left)
            return { overlap: ball.r - Math.hypot(left - ball.x, top - ball.y), where: "B" };
        //around 'A' point
        if (ball.x > right)
            return { overlap: ball.r - Math.hypot(right - ball.x, top - ball.y), where: "A" };
        //directly above
        return { overlap: (square.getHeight() / 2 + ball.r) - (middle.y - ball.y), where: "above" };
    }
    //ball is under the square
    if (ball.y > bottom) {
        //around 'C' point
        if (ball.x < left)
            return { overlap: ball.r - Math.hypot(left - ball.x, bottom - ball.y), where: "C" };
        //around 'D' point
        if (ball.x > right)
            return { overlap: ball.r - Math.hypot(right - ball.x, bottom - ball.y), where: "D" };
        //under it
        return { overlap: (square.getHeight() / 2 + ball.r) + (middle.y - ball.y), where: "under" };
    }
    // one the sides
    //ball.y < bottom & ball.y > top
    if (ball.x < left)
        return { overlap: (square.getWidth() / 2 + ball.r) - (middle.x - ball.x), where: "left" };
    if (ball.x > right)
        return { overlap: (square.getWidth() / 2 + ball.r) + (middle.x - ball.x), where: "right" };

    return { overlap: 1, where: "above" };
}


engine.squareBallCollision = function (square, ball) {
    /*
      PI/2
     B     A
      ****
 PI   ****   0
      ****
    C       D
     PI*3/2
*/
    let { x: x, y: y } = square.getCenter();
    x = x - ball.x;
    y = y - ball.y;
    let angle = Math.PI - Math.atan2(y, x);

    //static displacing
    let { overlap, where } = engine.squareBallOverlap(square, ball);

    if (where == "under") {
        ball.y += overlap;
    }
    else if (where == "above") {
        ball.y -= overlap;
    }
    else if (where == "right") {
        ball.x += overlap;
    }
    else if (where == "left") {
        ball.x -= overlap;
    }
    else { // around the corners
        ball.x += Math.cos(angle) * overlap;
        ball.y -= Math.sin(angle) * overlap;
    }
    //~static displacing

    //collision effect
    if (angle <= engine.squareBallCollision.A || angle > engine.squareBallCollision.D)
        ball.vx *= -engine.friction
    else if (angle <= engine.squareBallCollision.B && angle > engine.squareBallCollision.A)
        ball.vy *= -engine.friction
    else if (angle <= engine.squareBallCollision.C && angle > engine.squareBallCollision.B)
        ball.vx *= -engine.friction
    else //if (angle <= engine.squareBallCollision.D && angle > engine.squareBallCollision.C)
        ball.vy *= -engine.friction
}
engine.squareBallCollision.A = Math.PI / 4;
engine.squareBallCollision.B = Math.PI * 3 / 4;
engine.squareBallCollision.C = Math.PI * 5 / 4;
engine.squareBallCollision.D = Math.PI * 7 / 4;


engine.rectBallOverlap = function (rect, ball) {
    return engine.squareBallOverlap(rect, ball);
}

engine.rectBallCollision = function (rect, ball) {
    /*
      PI/2
     B     A
      ****
 PI   ****   0
      ****
    C       D
     PI*3/2
*/
    let { x: x, y: y } = rect.getCenter();
    let angle = Math.PI - Math.atan2(y - ball.y, x - ball.x);

    //static displacing
    let { overlap, where } = engine.rectBallOverlap(rect, ball);

    if (where == "under") {
        ball.y += overlap;
    }
    else if (where == "above") {
        ball.y -= overlap;
    }
    else if (where == "right") {
        ball.x += overlap;
    }
    else if (where == "left") {
        ball.x -= overlap;
    }
    else { // around the corners
        ball.x += Math.cos(angle) * overlap;
        ball.y -= Math.sin(angle) * overlap;
    }
    //~static displacing

    let corners = rect.getCorners();

    let A = Math.PI - Math.atan2(y - corners.A.y, x - corners.A.x);
    let B = Math.PI - Math.atan2(y - corners.B.y, x - corners.B.x);
    let C = Math.PI - Math.atan2(y - corners.C.y, x - corners.C.x);
    let D = Math.PI - Math.atan2(y - corners.D.y, x - corners.D.x);


    //collision effect
    if (angle <= A || angle > D)
        ball.vx *= -engine.friction
    else if (angle <= B && angle > A)
        ball.vy *= -engine.friction
    else if (angle <= C && angle > B)
        ball.vx *= -engine.friction
    else //if (angle <= D && angle > C)
        ball.vy *= -engine.friction
}

// from javidx
engine.roundRectBallCollision = function (rect, ball) {

    // Check that line formed by velocity vector, intersects with line segment
    let fLineX1 = rect.ex - rect.sx;
    let fLineY1 = rect.ey - rect.sy;

    let fLineX2 = ball.x - rect.sx;
    let fLineY2 = ball.y - rect.sy;

    let fEdgeLength = fLineX1 * fLineX1 + fLineY1 * fLineY1;

    // This is nifty - It uses the DP of the line segment vs the line to the object, to work out
    // how much of the segment is in the "shadow" of the object vector. The min and max clamp
    // this to lie between 0 and the line segment length, which is then normalised. We can
    // use this to calculate the closest point on the line segment
    let t = Math.max(0, Math.min(fEdgeLength, (fLineX1 * fLineX2 + fLineY1 * fLineY2))) / fEdgeLength;

    // Which we do here
    let fClosestPointX = rect.sx + t * fLineX1;
    let fClosestPointY = rect.sy + t * fLineY1;

    // And once we know the closest point, we can check if the ball has collided with the segment in the
    // same way we check if two balls have collided
    let fDistance = Math.sqrt((ball.x - fClosestPointX) * (ball.x - fClosestPointX) + (ball.y - fClosestPointY) * (ball.y - fClosestPointY));

    engine.ballBallCollision(ball, { x: fClosestPointX, y: fClosestPointY, r: rect.r, vx: 0, vy: 0, mass: 200 })

    // Calculate displacement required
    let fOverlap = 1 * (fDistance - ball.r - rect.r);

    // Displace Current Ball away from collision
    ball.x -= fOverlap * (ball.x - fClosestPointX) / fDistance;
    ball.y -= fOverlap * (ball.y - fClosestPointY) / fDistance;
}

engine.simulatePhysics = function (entities) {
    let now = performanceNow();
    engine.deltaTime = (now - engine.lastTick) / 1000;
    global.deltaTime = engine.deltaTime;
    engine.lastTick = now;

    // this way there is always a given number of phisycs updates in a second
    let loopindex = Math.ceil(engine.deltaTime / engine.PhysicsPrecision);

    for (let i = 0; i < loopindex; i++) {
        let deltatime = engine.deltaTime / loopindex;
        engine.index = engine.createIndex(entities);

        for (let entity of entities) {
            //csak a ra vonatkozo dolgok
            entity.physicsUpdate(deltatime);
            //utkozesek
            const others = engine.index.query(entity);
            others.forEach(other => {
                engine.handleCollision(entity, other);
            });
        }
    }
};


engine.place_meeting = function (x, y, w, h, obj) {

    let friend = false;
    const entities = engine.index.query(new engine.Entity(
        x,
        y,
        w,
        h)
    );

    for (let entity of entities) {

        if (entity.constructor.name == obj.name) {
            friend = entity;
            break;
        }
    }

    return friend;
};

engine.point_meeting = function (x, y, obj) {
    return engine.place_meeting(x, y, 1, 1, obj);
}

engine.nearest = function (x, y, obj) {
    let closest = null;
    let distance = Infinity;
    for (let i = 0; i < global.entities.length; i++) {
        const element = global.entities[i];
        if (typeof (element) == obj) {
            let currDistance = Math.hypot(element.getCenter().x - x, element.getCenter().y - y);
            if (currDistance < distance) {
                closest = element;
                distance = currDistance;
            }
        }
    }
    return closest;
}

engine.Entity = class Entity {
    constructor(x, y, w, h, shape = engine.shapes.SQUARE) {
        this.id = global.objID;
        global.objID++;

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
    getDir() {
        let vdist = Math.hypot(this.vx, this.vy);
        if (this.vx == this.vy && this.vx == 0)
            return { x: 0, y: 1 };
        return { x: this.vx / vdist, y: this.vy / vdist }
    }
    getCenter() {
        return { x: this.x + this.getWidth() / 2, y: this.y + this.getHeight() / 2 };
    }

    update() {
    }

    physicsUpdate() {
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

module.exports = engine;

