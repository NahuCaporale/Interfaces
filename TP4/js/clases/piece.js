class Pieza {
  constructor(x, y, tipo,tamanioCelda,offsetX,offsetY) {
    this.x = x;
    this.y = y;
    this.tipo = tipo;
    this.active = false;
    this.isDrag = false;
    //posicion de cada pieza
    this.posX = offsetX + y * tamanioCelda + tamanioCelda / 2;
    this.posY = offsetY + x * tamanioCelda + tamanioCelda / 2;
    this.radius = tamanioCelda / 2;
  }
  isPointInside(x, y) {
    // convertimos la posición de la pieza (fila/col) a coordenadas dentro del canvas
    let _x = this.posX - x;
    let _y = this.posY - y;
    return Math.sqrt(_x * _x + _y * _y) < this.radius;
  }
}
