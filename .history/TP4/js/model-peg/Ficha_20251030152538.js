class Ficha {
    constructor(posX, posY, fill, context) {
        this.posX = posX;
        this.posY = posY;
        this.fill = fill;
        this.resaltado = false;
        this.resaltadoEstilo = 'red';//agregar metodo para cambiar de color
        this.ctx = context;
    }

    setFill(fill) {
        this.fill = fill;
    }
    setPosition(x, y) {
        this.posX = x;
        this.posY = y;
    }
    getPosition() {
        return { x: this.posX, y: this.posY };
    }
    getPosX() {
        return this.posX;
    }

    getPosY() {
        return this.posY;
    }

    draw() {   
        this.ctx.fillStyle = this.fill;
     }

     setResaltado(resaltado) {
        this.resaltado = resaltado;
     }
     isPointInside(x, y) {  
        return !((x < this.posX) || (x > this.posX + this.width) || (y < this.posY) || (y > this.posY + this.width));
     }
}