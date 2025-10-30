class JuegoVista {
    constructor(canvas, tablero) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tablero = tablero;
    }

    drawFigure() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#F8F8FF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.tablero.fichas.forEach(f => f.draw());
    }
}

export default JuegoVista;
