class Tablero {
  constructor() {
    this.grid = [];
    this.size = 7;
    this.pieces = [];
    this.generarTablero();
  }
  generarTablero() {
    this.grid = [];
    for (let fila = 0; fila < this.size; fila++) {
      this.grid[fila] = [];
      for (let columna = 0; columna < this.size; columna++) {
        if ((fila <= 1 || fila > 4) && (columna <= 1 || columna > 4)) {
          this.grid[fila][columna] = -1;
        } else if (fila === 3 && columna === 3) {
          this.grid[fila][columna] = 0;
        }
        // Resto con fichas
        else {
          this.grid[fila][columna] = 1;
        }
      }
    }
  }
  generarPiezas(tamanioCelda, offsetX, offsetY) {
    let normales = 0;
    let especiales = 0;

    for (let fila = 0; fila < this.size; fila++) {
      for (let colum = 0; colum < this.size; colum++) {
        if (this.grid[fila][colum] == 1) {
          let tipo;

          if (normales <= especiales) {
            tipo = "fichaNormal";
            normales++;
          } else {
            tipo = "fichaEspecial";
            especiales++;
          }

          let pieza = new Pieza(
            fila,
            colum,
            tipo,
            tamanioCelda,
            offsetX,
            offsetY
          );
          this.pieces.push(pieza); 
        }
      }
    }
  }
  getGrid() {
    return this.grid;
  }
  setGrid(grid) {
    this.grid = grid;
  }
}
