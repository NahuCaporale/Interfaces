class GameController {
  constructor(canvas, tablero, vista) {
    this.canvas = canvas;
    this.tablero = tablero;
    this.vista = vista;
    this.piezaSelecciona = null;
    this.handleMouseDown = (e) => this.onMouseDown(e);
    this.handleMouseMove = (e) => this.onMouseMove(e);
    this.handleMouseUp = (e) => this.onMouseUp(e);
    this.setupListeners();
    this.tiempoInicio = 0;
    this.juegoTerminado = false;
    this.hints = [];
  }

  setupListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
  }
  destroyListeners() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
  }
  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let clickeada = this.findClickedFigure(x, y);

    if (clickeada) {
      this.piezaSelecciona = clickeada;
      this.piezaSelecciona.active = true;
      this.piezaSelecciona.isDrag = true;
      this.hints = this.obtenerMovimientosValidos(clickeada);

      this.dibujarHints(this.hints);
      console.log("Movimientos válidos:", this.hints);
    }
  }
  onMouseUp(e) {
    if (this.piezaSelecciona) {
      // coord x y del mouse
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const celdaDestino = this.movimiento(x, y);

      if (celdaDestino) {
        console.log("Pieza soltada en:", celdaDestino);
        this.validarMovimiento(celdaDestino);
      } else {
        console.log("Pieza soltada fuera del tablero");
      }

      // 4. soltar pieza
      this.piezaSelecciona.isDrag = false;
      this.piezaSelecciona.active = false;
      this.piezaSelecciona = null;
      this.ocultarHints();
      this.hints = [];
    }
  }
  onMouseMove(e) {
    if (this.piezaSelecciona && this.piezaSelecciona.isDrag) {
      // coordenadas del mouse en el canvas
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // act posición de la pieza
      this.piezaSelecciona.posX = mouseX;
      this.piezaSelecciona.posY = mouseY;
    }
  }

  findClickedFigure(x, y) {
    let piezas = this.tablero.pieces;
    for (let index = 0; index < piezas.length; index++) {
      let pieza = piezas[index];
      if (pieza.isPointInside(x, y)) {
        pieza.active = true;
        this.piezaSelecciona = pieza;
        return pieza;
      }
    }
  }

  movimiento(x, y) {
    const relativeX = x - this.vista.offsetX;
    const relativeY = y - this.vista.offsetY;
    const columna = Math.floor(relativeX / this.vista.tamanioCelda);
    const fila = Math.floor(relativeY / this.vista.tamanioCelda);
    if (
      fila < 0 ||
      fila >= this.tablero.size ||
      columna < 0 ||
      columna >= this.tablero.size
    ) {
      return null; //click fuera del canvas
    }

    return { fila, columna };
  }
  esMovimientoValido(piezaOrigen, celdaDestino) {
    const origen = { fila: piezaOrigen.x, columna: piezaOrigen.y };
    const dest = celdaDestino;

    //checkeo limites de tablero
    if (
      dest.fila < 0 ||
      dest.fila >= this.tablero.size ||
      dest.columna < 0 ||
      dest.columna >= this.tablero.size
    ) {
      return false;
    }

    // verificar si esta vacia la celda destino
    if (this.tablero.grid[dest.fila][dest.columna] !== 0) {
      return false;
    }

    let filaInt, colInt;

    // verificar el salto de 2 celdas
    if (
      origen.fila === dest.fila &&
      Math.abs(origen.columna - dest.columna) === 2
    ) {
      colInt = (origen.columna + dest.columna) / 2;
      filaInt = origen.fila;
    } else if (
      origen.columna === dest.columna &&
      Math.abs(origen.fila - dest.fila) === 2
    ) {
      filaInt = (origen.fila + dest.fila) / 2;
      colInt = origen.columna;
    } else {
      return false; // no son 2 celdas
    }

    // verificar si comio alguna ficha, para que sea valdio
    if (this.tablero.grid[filaInt][colInt] !== 1) {
      return false;
    }

    // Si pasó todas las reglas, es válido
    return true;
  }
  validarMovimiento(celda) {
    const pieza = this.piezaSelecciona;
    const destino = celda;

    if (this.esMovimientoValido(pieza, destino)) {
      let filaInt, colInt;
      if (pieza.x === destino.fila) {
        // Horizontal
        colInt = (pieza.y + destino.columna) / 2;
        filaInt = pieza.x;
      } else {
        // Vertical
        filaInt = (pieza.x + destino.fila) / 2;
        colInt = pieza.y;
      }

      console.log("¡Movimiento VÁLIDO!");
      this.mover(
        { fila: pieza.x, columna: pieza.y }, // origen
        destino,
        { fila: filaInt, columna: colInt } // intermedia
      );
    } else {
      console.log("Movimiento inválido");
    }
  }
  mover(origen, destino, intermedia) {
    const grid = this.tablero.grid;
    const piezas = this.tablero.pieces;

    grid[origen.fila][origen.columna] = 0;
    grid[intermedia.fila][intermedia.columna] = 0; //comemos la pieza
    grid[destino.fila][destino.columna] = 1;

    this.piezaSelecciona.x = destino.fila;
    this.piezaSelecciona.y = destino.columna;

    let indiceComida = -1;

    for (let i = 0; i < piezas.length; i++) {
      if (
        piezas[i].x === intermedia.fila &&
        piezas[i].y === intermedia.columna
      ) {
        indiceComida = i;
        break;
      }
    }

    if (indiceComida > -1) {
      piezas.splice(indiceComida, 1);
    } else {
      console.log("Error: no se encontró la pieza comida en el array");
    }
    if (this.verificarMovimientos()) {
      const mejorTiempo = localStorage.getItem("pegScores");

      this.juegoTerminado = true;
      const segundosFinales = Math.floor(
        (Date.now() - this.tiempoInicio) / 1000
      );
      if (this.winCondition()) {
        if (!mejorTiempo || parseInt(mejorTiempo) > segundosFinales) {
          localStorage.setItem("pegScores", segundosFinales);
        }
      }
      this.vista.tiempoFinal(segundosFinales);
      this.vista.mostrarMenuFinal();
      console.log("!No quedan mas movimientos");
    }
  }
  verificarMovimientos() {
    const piezas = this.tablero.pieces;
    //checkeamos por cada piezas si puede moverse
    for (const pieza of piezas) {
      // 1.  ARRIBA
      if (
        this.esMovimientoValido(pieza, { fila: pieza.x - 2, columna: pieza.y })
      ) {
        return false;
      }
      // 2.  ABAJO
      if (
        this.esMovimientoValido(pieza, { fila: pieza.x + 2, columna: pieza.y })
      ) {
        return false;
      }
      // 3.  IZQUIERDA
      if (
        this.esMovimientoValido(pieza, { fila: pieza.x, columna: pieza.y - 2 })
      ) {
        return false;
      }
      // 4.  DERECHA
      if (
        this.esMovimientoValido(pieza, { fila: pieza.x, columna: pieza.y + 2 })
      ) {
        return false;
      }
    }
    return true;
  }
  obtenerMovimientosValidos(pieza) {
    const movimientosPosibles = [];

    // Arriba
    if (
      this.esMovimientoValido(pieza, { fila: pieza.x - 2, columna: pieza.y })
    ) {
      movimientosPosibles.push({
        fila: pieza.x - 2,
        columna: pieza.y,
        direccion: "arriba",
      });
    }
    // Abajo
    if (
      this.esMovimientoValido(pieza, { fila: pieza.x + 2, columna: pieza.y })
    ) {
      movimientosPosibles.push({
        fila: pieza.x + 2,
        columna: pieza.y,
        direccion: "abajo",
      });
    }
    // Izquierda
    if (
      this.esMovimientoValido(pieza, { fila: pieza.x, columna: pieza.y - 2 })
    ) {
      movimientosPosibles.push({
        fila: pieza.x,
        columna: pieza.y - 2,
        direccion: "izquierda",
      });
    }
    // Derecha
    if (
      this.esMovimientoValido(pieza, { fila: pieza.x, columna: pieza.y + 2 })
    ) {
      movimientosPosibles.push({
        fila: pieza.x,
        columna: pieza.y + 2,
        direccion: "derecha",
      });
    }

    return movimientosPosibles;
  }
  dibujarHints(movimientos) {
    this.vista.dibujarHints(movimientos);
  }
  ocultarHints() {
    this.vista.ocultarHints();
  }
  winCondition() {
    return this.tablero.pieces.length == 1;
  }
}
