import Tablero from "./model-peg/Tablero.js";
import Ficha from "./model-peg/Ficha.js";
import JuegoVista from "./view-peg/JuegoVista.js";
import JuegoControlador from "./controller-peg/JuegoController.js";

const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const tablero = new Tablero(ctx, canvas);

const vista = new JuegoVista(canvas, tablero);
const controlador = new JuegoControlador(tablero, vista);

vista.drawFigure();

// Función auxiliar
function randomRGBA() {
    let r = Math.round(Math.random() * 255);
    let g = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
    let a = 1;
    return `rgba(${r},${g},${b},${a})`;
}
