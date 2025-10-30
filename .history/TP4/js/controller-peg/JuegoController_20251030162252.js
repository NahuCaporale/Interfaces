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
    let fichas = [];
    let isMouseDown = false;
    let lastClickedFicha = null;

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


     onMouseDown(e) {
        isMouseDown = true;
        if(lastClickedFicha != null){
            lastClickedFicha.setResaltado(false);
            lastClickedFicha = null;
        }

        let clickFicha = findClickedFicha(e.layerX, e.layerY);//cordenadas x e y dentro del canvas
        if(clickFicha != null){
            clickFig.setResaltado(true);
            lastClickedFicha = clickFicha;
        }
        drawFigure();
    }
     onMouseMove(e) {
        if(isMouseDown&& lastClickedFicha != null){
            lastClickedFicha.setPosition(e.layerX, e.layerY);
            drawFigure();
        }
    }
    function onMouseUp(e) {
        isMouseDown = false;    
    }


    function findClickedFicha(x, y) {
        for (let i = 0; i < fichas.length; i++) {
            let ficha = fichas[i];
            if (ficha.isPointInside(x, y)) {
                return ficha;
            }
        }
        return null;

    }
}


canvas.addEventListener('mousedown', onMouseDown,false);
canvas.addEventListener('mouseup', onMouseUp,false);
canvas.addEventListener('mousemove', onMouseMove,false);

export default JuegoControlador;
