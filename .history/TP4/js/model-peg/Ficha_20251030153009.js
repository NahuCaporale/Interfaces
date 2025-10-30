class Ficha extends Figure {   
    
    constructor(posX, posY, fill, context) {
        super(posX, posY, fill, context);
        this.radius= this.radius;
    }

    draw() {
        super.draw();
        this.ctx.beginPath();
        this.ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();

        if (this.resaltado) {
            this.ctx.strokeStyle = this.resaltadoEstilo;
            this.ctx.lineWidth = 5;
            this.ctx.stroke();
        }
        this.ctx.closePath();
    }

    getRadius() {
        return this.radius;
    }
   }
