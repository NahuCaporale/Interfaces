class Tablero {
    constructor(){
        this.fichas = [];
    }

    agregarFicha(ficha) {
        this.fichas.push(ficha);
    }

    eliminarFicha(ficha) {
        const index = this.fichas.indexOf(ficha);
        if (index > -1) {
            this.fichas.splice(index, 1);
        }
    }

    getFichas() {
        return this.fichas;
    }
    getFichaEnPosicion(x, y) {
        return this.fichas.find(ficha => ficha.isPointInside(x, y));
    }
    limpiarResaltados() {
        this.fichas.forEach(ficha => ficha.setResaltado(false));
    }
}
export default Tablero;