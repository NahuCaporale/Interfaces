class Vista {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    
    // mejor calidad de renderizado ¡?
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    
    this.tamanioCelda = 80;

    this.anchoTablero = 7 * this.tamanioCelda;
    this.altoTablero = 7 * this.tamanioCelda;

    this.offsetX = (this.canvas.width - this.anchoTablero) / 2;
    this.offsetY = (this.canvas.height - this.altoTablero) / 2;
    //menus
    this.menuPrincipal = document.getElementById("start-menu");
    this.contenedor = document.querySelector(".img-container");
    this.mejorScore = document.getElementById("score-1");
    this.menuFinal = document.getElementById("end-menu");
    this.tiempoTotal = document.getElementById("timer-display-final");
    this.timer = document.getElementById("timer");
    this.bestTime = document.getElementById("best");
    this.hints = [];
  }
  dibujarTablero(tablero, assets) {
    for (let fila = 0; fila < tablero.grid.length; fila++) {
      for (let columna = 0; columna < tablero.grid.length; columna++) {
        let celda = tablero.grid[fila][columna];

        // Coordenadas en el canvas
        let x =
          this.offsetX + columna * this.tamanioCelda + this.tamanioCelda / 2;
        let y = this.offsetY + fila * this.tamanioCelda + this.tamanioCelda / 2;
        if (celda !== -1) {
          let imgFondoCelda = assets["celda"];
          if (imgFondoCelda) {
            this.dibujarImagen(imgFondoCelda, x, y);
          }
        }
      
      }
    }
  }
  dibujarPiezas(piezas, assets) {
    let piezaArrastrando = null;
    let x, y;
    piezas.forEach((pieza) => {
      if (pieza.isDrag) {
        piezaArrastrando = pieza;
        // coordenadas mouse
        x = pieza.posX;
        y = pieza.posY;
        return;
      } else {
        x = this.offsetX + pieza.y * this.tamanioCelda + this.tamanioCelda / 2;
        y = this.offsetY + pieza.x * this.tamanioCelda + this.tamanioCelda / 2;
        pieza.posX = x;
        pieza.posY = y;
      }
      let imagen = assets[pieza.tipo];
      if (imagen) {
        this.dibujarImagen(imagen, x, y);
      }
      
    });
    if (piezaArrastrando) {
        let imagen = assets[piezaArrastrando.tipo];
        if (imagen) {
          this.dibujarImagen(
            imagen,
            piezaArrastrando.posX,
            piezaArrastrando.posY
          );
        }
      }
  }
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  dibujarImagen(imagen, x, y) {
    this.ctx.drawImage(
      imagen,
      x - this.tamanioCelda / 2,
      y - this.tamanioCelda / 2,
      this.tamanioCelda,
      this.tamanioCelda
    );
  }
  dibujarFondo(assets) {
    let imgFondo = assets["fondoTablero"];
    if (imgFondo && imgFondo.complete) {
      this.ctx.drawImage(imgFondo, 0, 0, this.canvas.width, this.canvas.height);
    }
  }
  dibujarCirculo(x, y, color, relleno) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.tamanioCelda / 2, 0, 2 * Math.PI);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();

    if (relleno) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }
  }
  mostrarMenuFinal() {
    this.contenedor.classList.add("terminado"); //oscurece el tablero
    this.menuFinal.classList.remove("hidden");
  }
  esconderMenuFinal() {
    this.contenedor.classList.remove("terminado");
    this.menuFinal.classList.add("hidden");
  }
  esconderMenuInicio() {
    this.menuPrincipal.classList.add("hidden"); // Oculta el menú INICIAL
    document.querySelector(".tiempos").classList.remove("hidden");
  }
  tiempoFinal(segundos) {
    if (this.tiempoTotal) {
      this.tiempoTotal.textContent = segundos;
    }
  }

  actualizarTiempo(segundos) {
    if (this.timer) {
      this.timer.textContent = `Tiempo: ${segundos}s`;
    }
  }
  mejorTiempo(tiempo) {
    if (tiempo && tiempo !== "NaN:NaN") {
      console.log(tiempo);

      this.bestTime.textContent = "Mejor Tiempo: " + tiempo;
    } else {
      this.bestTime.textContent = "Mejor Tiempo: --:--";
    }
  }
  dibujarHints(movimientos) {
    this.hints = movimientos || [];
  }
  ocultarHints() {
    this.hints = [];
  }
  renderizarHints() {
    if (!this.hints || this.hints.length === 0) return;
    this.hints.forEach((hint) => {
      const tiempo = Date.now() / 300; // velociadad
      const opacity = (Math.sin(tiempo) + 1) / 2; //opacidad
      // calcular pos
      const x =
        this.offsetX + hint.columna * this.tamanioCelda + this.tamanioCelda / 2;
      const y =
        this.offsetY + hint.fila * this.tamanioCelda + this.tamanioCelda / 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 30, 0, 2 * Math.PI);
      this.ctx.fillStyle = `rgba(211, 127, 133, ${opacity * 0.7})`;
      //rgba(211, 127, 133, 1)
      this.ctx.fill();
      this.ctx.strokeStyle = "rgba(211, 127, 133,1)";
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
    });
  }
}
