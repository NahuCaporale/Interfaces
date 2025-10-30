class JuegoVista {
    constructor(canvas, tablero) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tablero = tablero;
    }

    clearCanvas() {
        this.ctx.fillStyle = '#F8F8FF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawFigure() {
        this.clearCanvas();
        for (let ficha of this.tablero.getFichas()) {
            ficha.draw();
        }
    }
}

export default JuegoVista;
