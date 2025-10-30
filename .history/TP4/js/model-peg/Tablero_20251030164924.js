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
        const size = 7;
        const cellSize = this.canvas.width / size;

        for (let row = 0; row < size; row++) {
            this.grid[row] = [];
            for (let col = 0; col < size; col++) {
                // esquinas no válidas
                if ((row < 2 && col < 2) || (row < 2 && col > 4) ||
                    (row > 4 && col < 2) || (row > 4 && col > 4)) {
                    this.grid[row][col] = -1;
                    continue;
                }

                // el centro vacío
                const hasFicha = !(row === 3 && col === 3);
                this.grid[row][col] = hasFicha ? 1 : 0;

                if (hasFicha) {
                    const x = col * cellSize + cellSize / 2;
                    const y = row * cellSize + cellSize / 2;
                    const ficha = new Ficha(x, y, cellSize / 3, '#2b6cb0', this.ctx);
                    this.fichas.push(ficha);
                }
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
