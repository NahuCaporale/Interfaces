import Tablero from "./model-peg/Tablero.js";
import Ficha from "./js/modelo/Ficha.js";
import JuegoVista from "./js/vista/JuegoVista.js";
import JuegoControlador from "./js/controlador/JuegoControlador.js";

const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const tablero = new Tablero();

// Agregar fichas al azar
const CANT_FICHAS = 32;
for (let i = 0; i < CANT_FICHAS; i++) {
    let posX = Math.random() * canvas.width;
    let posY = Math.random() * canvas.height;
    let radius = 20;
    let color = randomRGBA();
    let ficha = new Ficha(posX, posY, radius, color, ctx);
    tablero.agregarFicha(ficha);
}

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
