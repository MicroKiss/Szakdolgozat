
//square shaped wall

export default class Wall {

    constructor(x, y, w, h = w) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = "gray";//"#" + ((1 << 24) * Math.random() | 0).toString(16);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //tmp

    }

}