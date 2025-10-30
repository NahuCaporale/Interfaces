class JuegoControlador {
    constructor(tablero, vista) {
        this.tablero = tablero;
        this.vista = vista;
        this.canvas = vista.canvas;
        this.ctx = vista.ctx;

        this.lastClickedFicha = null;
        this.isMouseDown = false;

        // Bind de eventos
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }

    // --- MOUSE DOWN ---
    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.isMouseDown = true;

        const fichaClickeada = this.tablero.getFichaEnPosicion(x, y);
        if (fichaClickeada) {
            // Desresalta la anterior
            if (this.lastClickedFicha) {
                this.lastClickedFicha.setResaltado(false);
            }

            fichaClickeada.setResaltado(true);
            this.lastClickedFicha = fichaClickeada;
        }

        this.vista.drawFigure();
    }

    // --- MOUSE MOVE ---
    onMouseMove(e) {
        if (!this.isMouseDown || !this.lastClickedFicha) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.lastClickedFicha.setPosition(x, y);
        this.vista.drawFigure();
    }

    // --- MOUSE UP ---
    onMouseUp(e) {
        this.isMouseDown = false;
    }
}

export default JuegoControlador;
