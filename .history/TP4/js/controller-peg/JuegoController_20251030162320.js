class JuegoControlador {
    constructor(tablero, vista) {
        this.tablero = tablero;
        this.vista = vista;
        this.canvas = vista.canvas;
        this.ctx = vista.ctx;

        this.lastClickedFicha = null;
        this.isMouseDown = false;

        // Asociar eventos del mouse
        this.canvas.addEventListener('click', (e) => this.onClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }

    // --- EVENTO CLICK ---
    onClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ficha = this.tablero.getFichaEnPosicion(x, y);
        if (ficha) {
            ficha.setResaltado(!ficha.resaltado);
        }

        this.vista.drawFigure();
    }

    // --- MOUSE DOWN ---
    onMouseDown(e) {
        this.isMouseDown = true;

        if (this.lastClickedFicha) {
            this.lastClickedFicha.setResaltado(false);
            this.lastClickedFicha = null;
        }

        const fichaClickeada = this.findClickedFicha(e.layerX, e.layerY);
        if (fichaClickeada) {
            fichaClickeada.setResaltado(true);
            this.lastClickedFicha = fichaClickeada;
        }

        this.vista.drawFigure();
    }

    // --- MOUSE MOVE ---
    onMouseMove(e) {
        if (this.isMouseDown && this.lastClickedFicha) {
            this.lastClickedFicha.setPosition(e.layerX, e.layerY);
            this.vista.drawFigure();
        }
    }

    // --- MOUSE UP ---
    onMouseUp(e) {
        this.isMouseDown = false;
    }

    // --- BUSCAR FICHA ---
    findClickedFicha(x, y) {
        const fichas = this.tablero.fichas; // acceso al modelo
        for (let i = 0; i < fichas.length; i++) {
            const ficha = fichas[i];
            if (ficha.isPointInside(x, y)) {
                return ficha;
            }
        }
        return null;
    }
}

export default JuegoControlador;
