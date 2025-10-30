// model-peg/Tablero.js
import Ficha from './Ficha.js';

class Tablero {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.fichas = [];
        this.grid = []; // matriz lógica 7x7
        this.initTablero();
    }

    initTablero() {
    const rows = 7;
    const cols = 7;

    // Calculamos el tamaño dinámico según el canvas
    const radius = Math.min(this.canvas.width, this.canvas.height) / 25;
    const spacing = radius * 2.5;

    // Centramos el tablero
    const startX = (this.canvas.width - (cols - 1) * spacing) / 2;
    const startY = (this.canvas.height - (rows - 1) * spacing) / 2;

    const color = 'rgba(50, 100, 200, 1)';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Solo agregamos fichas si está en la cruz del tablero
            if (
                (row < 2 && (col < 2 || col > 4)) ||
                (row > 4 && (col < 2 || col > 4))
            ) {
                continue; // Espacios vacíos
            }

            const x = startX + col * spacing;
            const y = startY + row * spacing;

            const ficha = new Ficha(x, y, radius, color, this.ctx);
            this.fichas.push(ficha);
        }
    }
}


    getFichaEnPosicion(x, y) {
        return this.fichas.find(ficha => ficha.isPointInside(x, y));
    }

    getFichas() {
        return this.fichas;
    }
}

export default Tablero;
