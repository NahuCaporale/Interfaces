class Ficha extends Figure {   
    
    constructor(posX, posY, fill, context) {
        super(posX, posY, fill, context);
        this.radius= this.radius;
    }

    draw() {
        super.draw();
        this.ctx.beginPath();
        this.ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, true);
        this.ctx.fill();

        if
        this.ctx.closePath();
    }
   }
