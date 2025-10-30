class JuegoControlador {
    constructor(tablero, vista) {
        this.tablero = tablero;
        this.vista = vista;
        this.canvas = vista.canvas;
        this.ctx = vista.ctx;

        this.lastClickedFicha = null;
        this.isMouseDown = false;

        this.canvas.addEventListener('click', (e) => this.onClick(e));
    }

    onClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let ficha = this.tablero.getFichaEnPosicion(x, y);
        if (ficha) {
            ficha.setResaltado(!ficha.resaltado);
        }

        this.vista.drawFigure();
    }
}


canvas.addEventListener(´´)

export default JuegoControlador;
