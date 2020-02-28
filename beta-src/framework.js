var fw = {};

fw._pressedKeys = {}; //asszociatív tömbben tároljuk, hogy egy gomb le van-e nyomva
document.onkeydown = function(e) {
    fw._pressedKeys[e.which] = true;
};

document.onkeyup = function(e) {
    fw._pressedKeys[e.which] = false;
};

fw.isDown = function(key) {
    return fw._pressedKeys[key] === true;
};

fw.image = function(src) {
    var img = document.createElement('img');
    img.src = src;
    return img;
};

fw.load = function(images, onLoad, onProgress) {
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
            images[i].addEventListener('load', function() {
                loaded++;
                checkLoaded();
            });
        }
    }
    checkLoaded();
};

fw.Entity = class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
    }

    draw() {
    }
};

export default fw;